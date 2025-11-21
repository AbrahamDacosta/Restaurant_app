import axios from 'axios';
import { GET_STORE_REVIEWS, GET_STORE_RATING } from '../api/routes';

class ReviewsDAO {
  /**
   * Get reviews for a store
   * @param {number} storeId - The store ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of reviews per page
   * @returns {Promise} Reviews data
   */
  async getStoreReviews(storeId, page = 1, limit = 10) {
    try {
      const response = await axios.post(GET_STORE_REVIEWS, {
        store_id: storeId,
        page,
        limit
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching store reviews:', error);
      throw error;
    }
  }

  /**
   * Get store rating summary
   * @param {number} storeId - The store ID
   * @returns {Promise} Rating data
   */
  async getStoreRating(storeId) {
    try {
      const response = await axios.post(GET_STORE_RATING, {
        store_id: storeId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching store rating:', error);
      throw error;
    }
  }
}

export default ReviewsDAO;
