import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CustomText, LargeText, SmallText, RegularText } from '../Globals/Texts';
import { PRIMARY_COLOR, TEXT_WHITE, TEXT_GRAY, CARD_BACKGROUND, BACKGROUND_DARK } from '../../Theme/Theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReviewItem from './ReviewItem';
import Daos from '../../Daos';
import { FontSizes, Spacing } from '../../Utils/Helpers/ResponsiveHelper';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

/**
 * StoreReviewsSection Component
 * Displays store rating summary and customer reviews
 */
export default function StoreReviewsSection({ storeId }) {
  const [reviews, setReviews] = React.useState([]);
  const [rating, setRating] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const loadReviews = async (pageNum = 1, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const reviewsData = await Daos.Reviews.getStoreReviews(storeId, pageNum, 10);

      if (append) {
        setReviews(prev => [...prev, ...(reviewsData.reviews || [])]);
      } else {
        setReviews(reviewsData.reviews || []);
      }

      setHasMore(reviewsData.has_more || false);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRating = async () => {
    try {
      const ratingData = await Daos.Reviews.getStoreRating(storeId);
      setRating(ratingData);
    } catch (err) {
      console.error('Error loading rating:', err);
    }
  };

  React.useEffect(() => {
    if (storeId) {
      loadReviews(1);
      loadRating();
    }
  }, [storeId]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadReviews(nextPage, true);
    }
  };

  const renderStars = (avgRating) => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`full-${i}`} name="star" size={24} color={PRIMARY_COLOR} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesome key="half" name="star-half-o" size={24} color={PRIMARY_COLOR} />
      );
    }

    const emptyStars = 5 - Math.ceil(avgRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome key={`empty-${i}`} name="star-o" size={24} color={TEXT_GRAY} />
      );
    }

    return stars;
  };

  if (isLoading && page === 1) {
    return (
      <View style={styles.container}>
        <LargeText fontFamily="bold" style={styles.sectionTitle}>
          Avis des clients
        </LargeText>
        <View style={styles.shimmerContainer}>
          <ShimmerPlaceholder style={styles.shimmerRating} />
          <ShimmerPlaceholder style={styles.shimmerReview} />
          <ShimmerPlaceholder style={styles.shimmerReview} />
          <ShimmerPlaceholder style={styles.shimmerReview} />
        </View>
      </View>
    );
  }

  if (error && !reviews.length) {
    return (
      <View style={styles.container}>
        <LargeText fontFamily="bold" style={styles.sectionTitle}>
          Avis des clients
        </LargeText>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={48} color={TEXT_GRAY} />
          <RegularText style={styles.errorText}>
            Impossible de charger les avis
          </RegularText>
          <TouchableOpacity onPress={() => loadReviews(1)} style={styles.retryButton}>
            <CustomText fontFamily="bold" style={styles.retryText}>
              Réessayer
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LargeText fontFamily="bold" style={styles.sectionTitle}>
        Avis des clients
      </LargeText>

      {/* Rating Summary */}
      {rating && (
        <View style={styles.ratingSummary}>
          <View style={styles.ratingLeft}>
            <CustomText fontFamily="bold" style={styles.ratingNumber}>
              {parseFloat(rating.average_rating || 0).toFixed(1)}
            </CustomText>
            <View style={styles.starsContainer}>
              {renderStars(parseFloat(rating.average_rating || 0))}
            </View>
            <SmallText style={styles.reviewCount}>
              {rating.total_reviews || 0} avis
            </SmallText>
          </View>

          {/* Rating bars */}
          {rating.rating_breakdown && (
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = rating.rating_breakdown[`${star}_star`] || 0;
                const percentage = rating.total_reviews > 0
                  ? (count / rating.total_reviews) * 100
                  : 0;

                return (
                  <View key={star} style={styles.ratingBarRow}>
                    <SmallText style={styles.starLabel}>{star}</SmallText>
                    <FontAwesome name="star" size={12} color={PRIMARY_COLOR} />
                    <View style={styles.barBackground}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${percentage}%` }
                        ]}
                      />
                    </View>
                    <SmallText style={styles.countLabel}>{count}</SmallText>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="comments-o" size={48} color={TEXT_GRAY} />
          <RegularText style={styles.emptyText}>
            Aucun avis pour le moment
          </RegularText>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => `review-${item.id || index}`}
          renderItem={({ item }) => <ReviewItem review={item} />}
          scrollEnabled={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && page > 1 ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={PRIMARY_COLOR} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.large,
  },
  sectionTitle: {
    color: TEXT_WHITE,
    fontSize: FontSizes.large,
    marginBottom: Spacing.medium,
  },
  shimmerContainer: {
    marginTop: Spacing.small,
  },
  shimmerRating: {
    height: 120,
    borderRadius: 12,
    marginBottom: Spacing.medium,
  },
  shimmerReview: {
    height: 100,
    borderRadius: 12,
    marginBottom: Spacing.medium,
  },
  ratingSummary: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 127, 0, 0.2)',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingLeft: {
    alignItems: 'center',
    marginRight: Spacing.large,
  },
  ratingNumber: {
    color: PRIMARY_COLOR,
    fontSize: 48,
    lineHeight: 56,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: Spacing.small,
    gap: 4,
  },
  reviewCount: {
    color: TEXT_GRAY,
    fontSize: FontSizes.small,
  },
  ratingBars: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  starLabel: {
    color: TEXT_WHITE,
    fontSize: FontSizes.small,
    width: 12,
    marginRight: 4,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 4,
  },
  countLabel: {
    color: TEXT_GRAY,
    fontSize: FontSizes.small,
    width: 30,
    textAlign: 'right',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxlarge,
  },
  emptyText: {
    color: TEXT_GRAY,
    fontSize: FontSizes.regular,
    marginTop: Spacing.medium,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxlarge,
  },
  errorText: {
    color: TEXT_GRAY,
    fontSize: FontSizes.regular,
    marginTop: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.small,
    borderRadius: 8,
  },
  retryText: {
    color: TEXT_WHITE,
    fontSize: FontSizes.regular,
  },
  loadingMore: {
    paddingVertical: Spacing.medium,
    alignItems: 'center',
  },
});
