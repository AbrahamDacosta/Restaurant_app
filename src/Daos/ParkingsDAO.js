import axios from 'axios';
import {SEARCH_PARKING_PLACE, PARKING_INDEX, PARKING_STATUS, MAKE_PLACE_RESERVATION, RESERVATIONS_HISTORIES} from '../api/routes';

export default class ParkingsDAO {
  async search({start_date, end_date, etage, freeSoon, parking}) {
    return (await axios.post(SEARCH_PARKING_PLACE, {
      start_date,
      end_date,
      freeSoon,
      parking,
    })).data;
  }
  async index(){
    return (await axios.get(PARKING_INDEX)).data;
  }

  async details({parkingId, start_date, end_date}){
    return (await axios.get(`${PARKING_STATUS}/${parkingId}`, {
      params: {
        start_date, end_date
      }
    })).data;
  }

  async makeReservation({start_date, end_date, place}){
    return (await axios.post(MAKE_PLACE_RESERVATION, {
        start_date, end_date, place
    })).data;
  }

  async reservationHistory(){
    return (await axios.get(RESERVATIONS_HISTORIES)).data;
  }
}
