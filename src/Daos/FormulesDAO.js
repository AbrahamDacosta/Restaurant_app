import axios from 'axios';
import {GET_FORMULES} from '../api/routes';

export default class FormulesDAO {
  async get() {
    return (await axios.get(GET_FORMULES)).data;
  }
}
