import moment from "moment";
import { ROOT_URL } from "../../../api/routes";

export const PLACE_OCCUPE = 'occupe';
export const PLACE_LIBRE = 'libre';
export const PLACE_CHOISIE = 'choisie';

export function getParkingPlaceMap(placesOccupes = [], myPlace, placeNumber) {
  const places = [];

  for (let i = 1; i <= placeNumber; i++) {
    if (placesOccupes.includes(i)) {
      places.push(PLACE_OCCUPE);
    } else if (myPlace == i) {
      places.push(PLACE_CHOISIE);
    } else places.push(PLACE_LIBRE);
  }

  return places;
}

export function etageToString(etageNumber){
  if (etageNumber == 0) return 'Rez-de-chaussée';
  else if (etageNumber == 1) return '1er étage';

  return `${etageNumber}e étage`;
}

export function numberFormat(value) {
  if (!value) return value;

  if((Math.floor(value) - value) !== 0)
      value = parseFloat(value).toFixed(2);

  value = value.toString()
  const d = value.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

  return `${d}`
}


export function formatDate(dateString, format = "dd MMM YYYY"){
  const momentInstance = moment(dateString)

  return momentInstance.format(format);
}

export function isCommandeStateEncours(state){
  return ["1", "2", "3", "4", "5", "6", "7"].includes(state);
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


export function getImageUrl(imagePath){
  return `${ROOT_URL}/images/${imagePath}`;
}