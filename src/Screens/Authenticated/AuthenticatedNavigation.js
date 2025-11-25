import React from 'react';
import { StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ParkingHomeScreen from './Parking/ParkingHomeScreen/ParkingHomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import ParkingSearchScreen from './Parking/ParkingSearchScreen/ParkingSearchScreen';
import ParkingSearchResultScreen from './Parking/ParkingSearchResultScreen/ParkingSearchResultScreen';
import ParkingReservationScreen from './Parking/ParkingReservationScreen/ParkingReservationScreen';
import SuccessfullReservationScreen from './Parking/SuccessfullReservationScreen/SuccessfullReservationScreen';
import MyParkingPlaceScreen from './Parking/MyPlaceParkingScreen/MyParkingPlaceScreen';
import SettingsHomeScreen from './Settings/SettingsHomeScreen/SettingsHomeScreen';
import Feather from 'react-native-vector-icons/Feather';
import AppTabBarNavigation from '../../Components/Navigation/AppTabBarNavigation';
import HomeScreen from './HomeTab/HomeScreen';
import CommandeTabScreen from './CommandeTab/CommandeTabScreen';
import CommandesScreen from './CommandesScreen/CommandesScreen';
import CommandeDetailsScreen from './CommandeDetailsScreen/CommandeDetailsScreen';
import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '../../Theme/Theme';
import UpdateUserInformationsScreen from './Settings/UpdateUserInformationsScreen/UpdateUserInformationsScreen';
import SimpleCommandeDetailsScreen from './CommandeDetailsScreen/SimpleCommandeDetailsScreen';
import UpdateCommandeScreen from './UpdateCommandeScreen/UpdateCommandeScreen';
import { firebase } from '@react-native-firebase/messaging';
import SoundNotificationPlayer from '../../Utils/Helpers/SoundNotificationPlayer';
import notifee, { AndroidColor, AndroidImportance } from '@notifee/react-native';
import ProductsScreen from './Products/ProductsScreen';
import RestaurantDashboardScreen from './Dashboard/RestaurantDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AuthenticatedNavigation() {

  React.useEffect(
    () => {

      (async () => {
        const channel = await notifee.createChannel({
          id: 'geofencing-1',
          name: 'Watch user position',
          lights: false,
          vibration: true,
          importance: AndroidImportance.HIGH,
        });

        const result = await notifee.displayNotification({
          title: 'Fako Store',
          body: 'Votre application store est en cours d\'execution',
          android: {
            channelId: 'geofencing-1',
            asForegroundService: true,
            colorized: false,
            importance: AndroidImportance.HIGH
          },
        });
      })();


      return () => {
        console.log("we will unmount service");
        notifee.stopForegroundService();
      }

    }, []
  );


  React.useEffect(
    () => {
      return firebase.messaging().onMessage(
        async (message) => {
          console.log("newMessage===> (foreground in AuthenticatedNavigation)", message);

          // Play notification sound based on message type
          if (message.data.type == "new-order-store")
            SoundNotificationPlayer.playAlarmSong();
          else {
            SoundNotificationPlayer.playAlarmSong(1);
            setTimeout(() => {
              SoundNotificationPlayer.stopAlarmSong();
            }, 1500)
          }

          // Afficher également une notification même en foreground
          const notifee = require('@notifee/react-native').default;
          const title = message.notification?.title || message.data?.title || 'Nouvelle commande';
          const body = message.notification?.body || message.data?.body || 'Vous avez reçu une nouvelle commande';

          await notifee.displayNotification({
            title: title,
            body: body,
            android: {
              channelId: 'order-notifications',
              importance: 4, // HIGH
              sound: 'samsung_galaxy',
              pressAction: {
                id: 'default',
                launchActivity: 'default',
              },
            },
          });
        }
      )
    }, []
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle={'light-content'} />

      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomeTabNavigator"
          component={AppTabNavigator}
        />
        <Stack.Screen
          name="ParkingReservationScreen"
          options={{ title: 'Reserver' }}
          component={ParkingReservationScreen}
        />
        <Stack.Screen
          name="UpdateCommandeScreen"
          options={{ title: 'Mise à jour de votre mot de passe', headerShown: false }}
          component={UpdateCommandeScreen}
        />

        <Stack.Screen
          name="UpdateUserInformationsScreen"
          options={{ title: 'Mise à jour de votre mot de passe' }}
          component={UpdateUserInformationsScreen}
        />

        <Stack.Screen
          options={{ title: 'Ou ai-je garé ma voiture ?' }}
          name="MyParkingPlaceScreen"
          component={MyParkingPlaceScreen}
        />

        <Stack.Screen
          name="ParkingSearchResultScreen"
          options={{ title: 'Resultat' }}
          component={ParkingSearchResultScreen}
        />

        <Stack.Screen
          name="SimpleCommandeDetailsScreen"
          options={{ headerShown: false }}
          component={SimpleCommandeDetailsScreen}
        />

        <Stack.Screen
          name="ParkingHomeScreen"
          options={{ title: 'Créer une place de parking' }}
          component={ParkingHomeScreen}
        />
        <Stack.Screen
          name="ParkingSearchScreen"
          options={{ title: 'Rechercher une place de libre' }}
          component={ParkingSearchScreen}
        />

        <Stack.Screen
          options={{ headerShown: false, }}
          name="SuccessfullReservationScreen"
          component={SuccessfullReservationScreen}
        />

        <Stack.Screen
          options={{ headerShown: false, }}
          name="Commande.Details"
          component={CommandeDetailsScreen}
        />

      </Stack.Navigator>
    </View>
  );
}

function AppTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <AppTabBarNavigation {...props} />}
      screenOptions={{
        headerShown: false,
      }}>

      <Tab.Screen
        options={{
          headerStyle: { backgroundColor: PRIMARY_COLOR, },
          headerTintColor: "white",
          headerShown: true,
          title: "Tableau de bord",
          tabBarLabel: 'Dashboard',
          tabBarIcon: function () {
            return <Feather name="bar-chart-2" />;
          },
        }}
        name="Dashboard"
        component={RestaurantDashboardScreen}
      />
      <Tab.Screen
        options={{
          headerStyle: { backgroundColor: PRIMARY_COLOR_DARK, },
          headerTintColor: "white",
          headerShown: true,
          title: "Mes commandes",
          tabBarLabel: 'Commandes',
          tabBarIcon: function () {
            return <Feather name="shopping-bag" />;
          },
        }}
        name="Commandes"
        component={CommandeTabScreen}
      />
      <Tab.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: PRIMARY_COLOR, },
          headerTintColor: "white",
          title: "Produits",
          tabBarLabel: 'Produits',
          tabBarIcon: function () {
            return <Feather name="box" />;
          },
        }}
        name="Home"
        component={ProductsScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Paramètres',
          tabBarIcon: function () {
            return <Feather name="settings" />;
          },
        }}
        name="SettingsHomeSreen"
        component={SettingsHomeScreen}
      />
    </Tab.Navigator>
  );
}
