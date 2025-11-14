import {
  GET_DEMANDES_INTERVENTION,
  POST_DEMANDE_INTERVENTION,
} from '../api/routes';
import axios from 'axios';

export default class DemandeInterventionDAO {
  async store({addressId, demandes}) {
    let formData = new FormData();

    formData.append('address', addressId);

    demandes.forEach((panneDatas, index) => {
      formData.append(`items[${index}][panne]`, panneDatas.panne);
      formData.append(`items[${index}][description]`, panneDatas.description);
      formData.append(`items[${index}][photo]`, {
        uri: panneDatas.photo.uri,
        type: panneDatas.photo.type,
        name: panneDatas.photo.fileName,
      });
    });

    return (
      await axios.post(POST_DEMANDE_INTERVENTION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data;
  }

  async getDemandes() {
    return (await axios.get(GET_DEMANDES_INTERVENTION)).data;
  }
}
