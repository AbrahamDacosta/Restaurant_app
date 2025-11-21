import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText, SmallText, RegularText } from '../Globals/Texts';
import { CARD_BACKGROUND, PRIMARY_COLOR, TEXT_GRAY, TEXT_WHITE } from '../../Theme/Theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/fr';
import { FontSizes, Spacing } from '../../Utils/Helpers/ResponsiveHelper';

moment.locale('fr');

/**
 * ReviewItem Component
 * Displays a single customer review with rating stars, comment, and date
 */
export default function ReviewItem({ review, style }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`full-${i}`} name="star" size={16} color={PRIMARY_COLOR} />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FontAwesome key="half" name="star-half-o" size={16} color={PRIMARY_COLOR} />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome key={`empty-${i}`} name="star-o" size={16} color={TEXT_GRAY} />
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={20} color={TEXT_WHITE} />
          </View>
          <View style={styles.userDetails}>
            <CustomText fontFamily="bold" style={styles.userName}>
              {review.customer_name || 'Client Fakodrop'}
            </CustomText>
            <SmallText style={styles.date}>
              {moment(review.created_at).format('DD MMM YYYY')}
            </SmallText>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(parseFloat(review.rating || 0))}
        </View>
      </View>

      {review.comment && (
        <RegularText style={styles.comment}>
          {review.comment}
        </RegularText>
      )}

      {review.order_reference && (
        <SmallText style={styles.orderRef}>
          Commande #{review.order_reference}
        </SmallText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 127, 0, 0.1)',
    // Shadow for iOS
    shadowColor: PRIMARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.small,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.small,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: TEXT_WHITE,
    fontSize: FontSizes.regular,
    marginBottom: 2,
  },
  date: {
    color: TEXT_GRAY,
    fontSize: FontSizes.small,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  comment: {
    color: TEXT_WHITE,
    fontSize: FontSizes.regular,
    lineHeight: 22,
    marginBottom: Spacing.small,
  },
  orderRef: {
    color: TEXT_GRAY,
    fontSize: FontSizes.small,
    fontStyle: 'italic',
  },
});
