import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { CustomText, SmallText, RegularText } from '../../../Components/Globals/Texts';
import { PRIMARY_COLOR, LIGHT_DARK, DEFAULT_BORDER_COLOR, ORANGE_COLOR } from '../../../Theme/Theme';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';
import Daos from '../../../Daos';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

export default function RestaurantDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ratingData, setRatingData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const user = useSelector(state => state.ApplicationStore.user);
  const storeId = user?.id;

  useEffect(() => {
    if (storeId) {
      fetchDashboardData();
    }
  }, [storeId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchRatingData(),
        fetchReviews(1)
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingData = async () => {
    try {
      const response = await Daos.Reviews.getStoreRating(storeId);
      if (response.success) {
        setRatingData(response.data);
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  };

  const fetchReviews = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await Daos.Reviews.getStoreReviews(storeId, page, 10);

      if (response.success) {
        const newReviews = response.data.reviews || [];

        if (page === 1) {
          setReviews(newReviews);
        } else {
          setReviews(prev => [...prev, ...newReviews]);
        }

        setHasMore(newReviews.length >= 10);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReviews(currentPage + 1);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Feather key={i} name="star" size={14} color={ORANGE_COLOR} style={{ marginRight: 2 }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Feather key={i} name="star" size={14} color={ORANGE_COLOR} style={{ marginRight: 2 }} />
        );
      } else {
        stars.push(
          <Feather key={i} name="star" size={14} color={DEFAULT_BORDER_COLOR} style={{ marginRight: 2 }} />
        );
      }
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={{ flex: 1 }}>
          <CustomText fontFamily="bold" style={styles.orderNumber}>
            #{item.order_number || item.commande_number}
          </CustomText>
          <SmallText style={styles.reviewDate}>
            {moment(item.created_at).format('DD/MM/YYYY à HH:mm')}
          </SmallText>
        </View>
        <View style={styles.ratingBadge}>
          <CustomText fontFamily="bold" style={styles.ratingText}>
            {item.note || item.rating}/5
          </CustomText>
        </View>
      </View>

      <View style={styles.starContainer}>
        {renderStarRating(item.note || item.rating || 0)}
      </View>

      {item.commentaire || item.comment ? (
        <View style={styles.commentContainer}>
          <RegularText style={styles.commentText}>
            {item.commentaire || item.comment}
          </RegularText>
        </View>
      ) : (
        <SmallText style={styles.noCommentText}>Aucun commentaire</SmallText>
      )}

      {item.customer_name && (
        <View style={styles.customerInfo}>
          <Feather name="user" size={14} color={LIGHT_DARK} />
          <SmallText style={{ marginLeft: 6, color: LIGHT_DARK }}>
            {item.customer_name}
          </SmallText>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <CustomText style={{ marginTop: 16 }}>Chargement...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <CustomText fontFamily="bold" style={styles.headerTitle}>
            Tableau de bord
          </CustomText>
          <SmallText style={styles.headerSubtitle}>
            Statistiques et avis clients
          </SmallText>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Orders Count Card */}
          <View style={styles.statCard}>
            <View style={styles.statCircle}>
              <CustomText fontFamily="bold" style={styles.statValue}>
                {ratingData?.total_orders || 0}
              </CustomText>
            </View>
            <CustomText style={styles.statLabel}>Nombre de commandes</CustomText>
          </View>

          {/* Average Rating Card */}
          <View style={styles.statCard}>
            <View style={[styles.statCircle, { borderColor: ORANGE_COLOR }]}>
              <CustomText fontFamily="bold" style={[styles.statValue, { color: ORANGE_COLOR }]}>
                {ratingData?.average_rating ? Number(ratingData.average_rating).toFixed(1) : '0.0'}
              </CustomText>
            </View>
            <CustomText style={styles.statLabel}>Moyenne évaluation</CustomText>
          </View>
        </View>

        {/* Rating Breakdown */}
        {ratingData && (
          <View style={styles.breakdownContainer}>
            <CustomText fontFamily="bold" style={styles.sectionTitle}>
              Répartition des notes
            </CustomText>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <CustomText fontFamily="semi">⭐⭐⭐⭐⭐</CustomText>
                <CustomText style={styles.breakdownValue}>
                  {ratingData.five_stars || 0}
                </CustomText>
              </View>
              <View style={styles.breakdownItem}>
                <CustomText fontFamily="semi">⭐⭐⭐⭐</CustomText>
                <CustomText style={styles.breakdownValue}>
                  {ratingData.four_stars || 0}
                </CustomText>
              </View>
              <View style={styles.breakdownItem}>
                <CustomText fontFamily="semi">⭐⭐⭐</CustomText>
                <CustomText style={styles.breakdownValue}>
                  {ratingData.three_stars || 0}
                </CustomText>
              </View>
              <View style={styles.breakdownItem}>
                <CustomText fontFamily="semi">⭐⭐</CustomText>
                <CustomText style={styles.breakdownValue}>
                  {ratingData.two_stars || 0}
                </CustomText>
              </View>
              <View style={styles.breakdownItem}>
                <CustomText fontFamily="semi">⭐</CustomText>
                <CustomText style={styles.breakdownValue}>
                  {ratingData.one_star || 0}
                </CustomText>
              </View>
            </View>
          </View>
        )}

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <CustomText fontFamily="bold" style={styles.sectionTitle}>
            Avis clients
          </CustomText>

          {reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="message-square" size={48} color={DEFAULT_BORDER_COLOR} />
              <CustomText style={styles.emptyText}>Aucun avis pour le moment</CustomText>
            </View>
          ) : (
            <FlatList
              data={reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item, index) => `review-${item.id || index}`}
              scrollEnabled={false}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                loadingMore ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                  </View>
                ) : null
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: DEFAULT_BORDER_COLOR,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: LIGHT_DARK,
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  statCard: {
    alignItems: 'center',
  },
  statCircle: {
    height: 80,
    width: 80,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: moderateScale(28, 0.3),
    color: PRIMARY_COLOR,
  },
  statLabel: {
    fontSize: FontSizes.small,
    textAlign: 'center',
    maxWidth: 120,
  },
  breakdownContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownValue: {
    marginTop: 4,
    fontSize: FontSizes.regular,
  },
  reviewsSection: {
    marginTop: 8,
    backgroundColor: 'white',
    padding: 16,
    minHeight: 200,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DEFAULT_BORDER_COLOR,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: FontSizes.regular,
    color: PRIMARY_COLOR,
  },
  reviewDate: {
    marginTop: 2,
    color: LIGHT_DARK,
    opacity: 0.6,
  },
  ratingBadge: {
    backgroundColor: ORANGE_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    color: 'white',
    fontSize: FontSizes.small,
  },
  starContainer: {
    marginVertical: 8,
  },
  commentContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DEFAULT_BORDER_COLOR,
  },
  commentText: {
    lineHeight: 20,
    color: LIGHT_DARK,
  },
  noCommentText: {
    fontStyle: 'italic',
    color: LIGHT_DARK,
    opacity: 0.5,
    marginTop: 8,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DEFAULT_BORDER_COLOR,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    color: LIGHT_DARK,
    opacity: 0.5,
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
