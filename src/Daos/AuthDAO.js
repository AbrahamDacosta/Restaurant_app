import { firebase } from '@react-native-firebase/messaging';
import { ME, REGISTER, LOGIN, UPDATE_FIREBASE_DEVICE_TOKEN, REFRESH_TOKEN } from '../api/routes';
import axios, { AxiosError } from 'axios';

export default class AuthDAO {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async register({ email, password, noms, prenoms }) {
    const tokenResponse = (
      await axios.post(REGISTER, {
        email: email.trim(),
        password,
        noms,
      })
    ).data;

    const user = await this.getUserInfo(tokenResponse.token);

    
    await firebase.messaging().subscribeToTopic('stores-online');
    await firebase.messaging().unsubscribeFromTopic('stores-offline');

    return {
      token: tokenResponse,
      user: user,
    };
  }

  async refreshToken(chaine){

    return (
      await axios.get(
        REFRESH_TOKEN, {
          params: {
            chaine
          }
        }
      )
    ).data
  }

  async login({ email, password }) {
    console.log("Login url", LOGIN, email, password);



    const tokenResponse = (
      await axios.post(LOGIN, {
        identifiant: email.trim(),
        password,
      },
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      )
    );

    if (tokenResponse?.data?.error != undefined) {
      console.log("throw error");
      throw new AxiosError(tokenResponse.data.error, undefined, undefined, undefined, tokenResponse);
    }

    console.log("token", tokenResponse.data.token);

    console.log("Before get user info");
    const user = await this.getUserInfo(tokenResponse.data.token);
    console.log("After get user info");

    
    await firebase.messaging().subscribeToTopic('stores-online');
    await firebase.messaging().unsubscribeFromTopic('stores-offline');

    return {
      token: tokenResponse.data,
      user: user,
    };
  }

  async getUserInfo(token) {
    console.log('me', ME);
    const response = (
      await axios.get(ME, {
        params: {
          chaine: token
        }
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
    );

    console.log('getUserInfoResponse', response.data);


    return response.data;
  }

  async updateFirebaseToken(firebaseDeviceToken, userId) {

    console.log("updateFirebaseToken()", firebaseDeviceToken, userId);

    return (
      await axios.post(UPDATE_FIREBASE_DEVICE_TOKEN, {
        id_user: userId,
        id_firebase: firebaseDeviceToken, user_type: "stores"
      },
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }

      )
    ).data;
  }

}
