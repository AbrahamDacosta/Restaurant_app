export const ROOT_URL = 'https://app.fakodrop.com';
// export const ROOT_URL = 'http://10.0.2.2:10000';
export const BASE_URL = `${ROOT_URL}/api`;

export const PAYMENT = `${ROOT_URL}/mobile-checkout`;

export const REGISTER = `${BASE_URL}/auth/register`;
export const LOGIN = `${BASE_URL}/login_store`;
export const REFRESH_TOKEN = `${BASE_URL}/refresh_token`;
export const ME = `${BASE_URL}/linkin_park`;

export const APPS_PARAMS = `${BASE_URL}/get_app_params`;

export const GET_CANCEL_REASON = `${BASE_URL}/liste_cancel_reason`;

export const GET_RIDER_POSITION = `${BASE_URL}/get_rider_position_by_commande`;

export const GET_STORE_REVENU = `${BASE_URL}/get_store_revenu`;
export const GET_STORE_PRODUCTS = `${BASE_URL}/liste_products_by_stores`;
export const TOGGLE_PRODUCT_DISPONIBILITY = `${BASE_URL}/switch_product_disponibility`;



export const UPDATE_FIREBASE_DEVICE_TOKEN = `${BASE_URL}/update_firebase_id`;

export const TOOGLE_ORDER_ACCEPTANCE = `${BASE_URL}/switch_order_acceptance`;

export const GET_ORDER_DETAILS = `${BASE_URL}/get_order_details`;
export const GET_EDITED_ORDER_DETAILS = `${BASE_URL}/get_edited_order_details`;
export const ACCEPT_COMMANDE = `${BASE_URL}/accept_order`;
export const DENIED_COMMANDE = `${BASE_URL}/decline_order`;
export const AFFECT_LIVREUR = `${BASE_URL}/search_rider_for_delivery`;
export const ORDER_READY = `${BASE_URL}/confirm_order_ready`;

export const EDIT_ORDER_FOR_MISSING_PRODUCT = `${BASE_URL}/estimate_order_on_edit`;


export const MAKE_PLACE_RESERVATION = `${BASE_URL}/reservations`;
export const RESERVATIONS_HISTORIES = `${BASE_URL}/reservations-history`;

export const SEARCH_PARKING_PLACE = `${BASE_URL}/parkings/search`;
export const PARKING_INDEX = `${BASE_URL}/parkings`;
export const PARKING_STATUS = `${BASE_URL}/parkings/status`;

export const GET_FORMULES = `${BASE_URL}/formule-plans`;

export const UPDATE_PROFIL = `${BASE_URL}/user`;
export const UPDATE_PHOTO = `${BASE_URL}/user/photo`;
export const UPDATE_PASSWORD = `${BASE_URL}/user/password/update`;
export const USER_STORE_ADDRESS = `${BASE_URL}/user/address`;
export const USER_DELETE_ADDRESS = `${BASE_URL}/user/address`;
export const USER_GET_ADDRESSES = `${BASE_URL}/user/addresses`;

export const PRECREATE_COMMANDE = `${BASE_URL}/commande`;
export const GET_COMMANDES = `${BASE_URL}/liste_orders_by_store`;

export const PRODUCTS = `${BASE_URL}/products`;

export const POST_SUBSCRIPTION_TO_FORMULE = `${BASE_URL}/users/formules/subscribe`;
export const GET_ACTIVE_ABONNEMENT = `${BASE_URL}/users/subscriptions/active-abonnement`;

export const POST_DEMANDE_INTERVENTION = `${BASE_URL}/demande-intervention`;
export const GET_DEMANDES_INTERVENTION = `${BASE_URL}/demandes-interventions`;







