/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import App from './src/App';
import SoundNotificationPlayer from './src/Utils/Helpers/SoundNotificationPlayer';
import messaging from '@react-native-firebase/messaging';
import store from './src/Store';
import moment from "moment";

import 'moment/locale/fr'  // without this line it didn't work

moment.locale('fr')

import notifee, { AndroidColor, AndroidImportance } from '@notifee/react-native';

// ReactNativeForegroundService.register();

async function onMessageReceived(message) {

  console.log("message received", message.data);

  const userToken = store.getState().ApplicationStore?.token;

  if (userToken != null) {

    if (message.data.type == "new-order-store") {
      print("...New store order");
      SoundNotificationPlayer.playAlarmSong();
    } else {
      SoundNotificationPlayer.playAlarmSong(1);
      setTimeout(() => {
        SoundNotificationPlayer.stopAlarmSong();
      }, 1500)
    }
    
  }
  // if (type === 'order_shipped') {
  //   notifee.displayNotification({
  //     title: 'Your order has been shipped',
  //     body: `Your order was shipped at ${new Date(Number(timestamp)).toString()}!`,
  //     android: {
  //       channelId: 'orders',
  //     },
  //   });
  // }
}

messaging().setBackgroundMessageHandler(onMessageReceived);



notifee.registerForegroundService((notification) => {

  return new Promise(() => {
    console.log("Service running...");
    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
        console.log("in the first case");
        await notifee.stopForegroundService()
      }
    });
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
        console.log("in the second case");
        await notifee.stopForegroundService()
      }
    });

  });
});




AppRegistry.registerComponent(appName, () => App);
