import axios from 'axios';
import {
  GET_ACTIVE_ABONNEMENT,
  GET_COMMANDES,
  UPDATE_PASSWORD,
  GET_FORMULES,
  POST_SUBSCRIPTION_TO_FORMULE,
  PRECREATE_COMMANDE,
  USER_GET_ADDRESS,
  USER_GET_ADDRESSES,
  USER_STORE_ADDRESS,
  USER_DELETE_ADDRESS,
  UPDATE_PROFIL,
  UPDATE_PHOTO,
  TOOGLE_ORDER_ACCEPTANCE,
  APPS_PARAMS,
  GET_STORE_REVENU,
  GET_STORE_PRODUCTS,
  TOGGLE_PRODUCT_DISPONIBILITY,
} from '../api/routes';

export default class UserDAO {

  async toggleProduct(productId){
    return (
      await axios.get(
        TOGGLE_PRODUCT_DISPONIBILITY, {
          params: {
            id_produit: productId
          }
        }
      )
    ).data
  }

  async getProductList(storeId, search){
    return (
      await axios.get(GET_STORE_PRODUCTS, {
        params: {
          id_store: storeId,
          search
        }
      })
    ).data
  }

  async getOrderResume({ dateStart, dateEnd, storeId }) {
    return (
      await axios.get(GET_STORE_REVENU, {
        params: {
          date_debut: dateStart,
          date_fin: dateEnd,
          id_store: storeId
        }
      })
    ).data
  }

  async getAppParams() {
    return (
      await axios.get(APPS_PARAMS)
    ).data
  }

  async toggleOrderAcceptance(userId) {
    return (
      await axios.get(TOOGLE_ORDER_ACCEPTANCE, {
        params: { id_store: userId }
      })
    ).data;
  }

  async updatePhoto({ photo }) {
    let formData = new FormData();

    formData.append(`photo`, {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName,
    });

    return (
      await axios.post(UPDATE_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data;
  }

  async updateProfile({ nom, prenoms, phone }) {
    return (
      await axios.post(UPDATE_PROFIL, {
        nom,
        prenoms,
        phone,
      })
    ).data;
  }

  async storeAddress({ libelle, contact, description, lat, lng }) {
    return (
      await axios.post(USER_STORE_ADDRESS, {
        libelle,
        contact,
        description,
        lat,
        lng,
      })
    ).data;
  }

  async deleteAddress(addressId) {
    return (await axios.delete(`${USER_DELETE_ADDRESS}/${addressId}`)).data;
  }

  async getAddresses() {
    return (await axios.get(USER_GET_ADDRESSES)).data;
  }

  async makeCommand({ cartItems, address, total }) {
    return (
      await axios.post(PRECREATE_COMMANDE, {
        cart_items: cartItems,
        total,
        address,
      })
    ).data;
  }

  async commandes() {
    return (await axios.get(GET_COMMANDES)).data;
  }

  async subscribeToFormule({ formuleId, splits, periode, addressId }) {
    return (
      await axios.post(POST_SUBSCRIPTION_TO_FORMULE, {
        formule: formuleId,
        splits,
        periode,
        address: addressId,
      })
    ).data;
  }

  async getActiveAbonnement() {
    return (await axios.get(GET_ACTIVE_ABONNEMENT)).data;
  }

  async updatePassword({ oldPassword, newPassword, newPasswordConfirmation }) {
    return (
      await axios.post(UPDATE_PASSWORD, {
        oldPassword,
        newPassword,
        newPasswordConfirmation,
      })
    ).data;
  }
}
