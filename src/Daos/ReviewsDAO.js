import axios from 'axios';
import { GET_STORE_REVIEWS, GET_STORE_RATING } from '../api/routes';
import moment from 'moment';

class ReviewsDAO {
  /**
   * Get reviews for a store
   * @param {number} storeId - The store ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of reviews per page
   * @param {string} dateDebut - Start date for filtering (optional, defaults to 1 year ago)
   * @param {string} dateFin - End date for filtering (optional, defaults to today)
   * @returns {Promise} Reviews data
   */
  async getStoreReviews(storeId, page = 1, limit = 10, dateDebut = null, dateFin = null) {
    try {
      // Default date range: last year to today
      const date_debut = dateDebut || moment().subtract(5, 'years').format('YYYY-MM-DD');
      const date_fin = dateFin || moment().format('YYYY-MM-DD');

      const response = await axios.post(GET_STORE_REVIEWS, {
        id_store: storeId,
        date_debut,
        date_fin,
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
        id_store: storeId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching store rating:', error);
      throw error;
    }
  }
}

export default ReviewsDAO;
