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

import notifee, { AndroidColor, AndroidImportance, EventType } from '@notifee/react-native';

// ReactNativeForegroundService.register();

// Créer le canal de notification avec le son personnalisé
async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'order-notifications',
    name: 'Nouvelles Commandes',
    sound: 'samsung_galaxy',
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [300, 500],
  });
}

// Initialiser le canal au démarrage
createNotificationChannel();

async function onMessageReceived(message) {

  console.log("message received in background/closed state", message.data);

  const userToken = store.getState().ApplicationStore?.token;

  if (userToken != null) {

    // Créer le titre et le corps de la notification
    const title = message.notification?.title || message.data?.title || 'Nouvelle commande';
    const body = message.notification?.body || message.data?.body || 'Vous avez reçu une nouvelle commande';

    // Afficher une notification avec le son
    // La notification jouera automatiquement le son via le système Android
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: 'order-notifications',
        importance: AndroidImportance.HIGH,
        sound: 'samsung_galaxy',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        vibrationPattern: [300, 500],
      },
    });

    console.log("Notification displayed with sound");
  }
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
