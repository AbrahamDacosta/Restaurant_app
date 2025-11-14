import axios from 'axios';
import {PRODUCTS} from '../api/routes';

export default class ProductsDAO {
  async products() {
    return (await axios.get(PRODUCTS)).data;
  }
}
