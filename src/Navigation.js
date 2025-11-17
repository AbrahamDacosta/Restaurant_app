import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Linking, Platform, StatusBar, View } from 'react-native';
import AuthNavigation from './Screens/Auth/AuthNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthenticatedNavigation from './Screens/Authenticated/AuthenticatedNavigation';
import FirstLaunchScreen from './Screens/FirstLaunch/FirstLaunchScreen';
import { useDispatch, useSelector } from 'react-redux';
import PolicyScreen from './Screens/Commons/PolicyScreen';
import CGUScreen from './Screens/Commons/CGUScreen';
import useListenDeviceToken from './notifications/useListenDeviceToken';
import Daos from './Daos';
import { updateAppParams } from './Store/ApplicationStore';
import useUser from './Hooks/useUser';
import { firebase } from '@react-native-firebase/messaging';
const Stack = createStackNavigator();

export const NAVIGATION_STATE_FIRST_LAUNCH = 1;
export const NAVIGATION_STATE_NOT_CONNECTED = 2;
export const NAVIGATION_STATE_CONNTECTED = 3;


function buildDeepLinkFromNotificationData(data) {
  console.log('buildDeepLinkFromNotificationData', data);

  if (data == undefined)
    return undefined;

  if (data.reference != undefined)
    return "myapp://open-commande-details"

  return 'myapp://home';

  // const navigationId = data?.navigationId;
  // if (!NAVIGATION_IDS.includes(navigationId)) {
  //   console.warn('Unverified navigationId', navigationId)
  //   return null;
  // }
  // if (navigationId === 'home') {
  //   return 'myapp://home';
  // }
  // if (navigationId === 'settings') {
  //   return 'myapp://settings';
  // }
  // const postId = data?.postId;
  // if (typeof postId === 'string') {
  //   return `myapp://post/${postId}`
  // }
  // console.warn('Missing postId')
  // return null
}

const linking = {
  prefixes: ['myapp://'],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await firebase.messaging().getInitialNotification();
    openerNotification = message;
    console.log("Message from notificatiion", message);
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },

  getStateFromPath: (path, options) => {


    if (path == undefined)
      return undefined;



    console.log('path=>', path, options);

    if (path == "home")
      return {
        index: 0,
        routes: [
          {
            name: 'AuthNavigation',
            state: {
              index: 0,
              routes: [
                {
                  name: 'HomeTabNavigator',
                }
              ]
            }
          },
        ],
      }

    return {
      index: 0,
      routes: [
        {
          name: 'AuthNavigation',
          state: {
            index: 1,
            routes: [
              {
                name: 'HomeTabNavigator',
                routes: [
                  {
                    name: "Commandes"
                  }
                ]
              },
              {
                name: 'Commande.Details',
                params: {
                  ...(openerNotification?.data ?? {}),
                  commandeId: openerNotification?.data?.reference
                }
              }
            ]
          }
        },
      ],
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => listener(url));

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = firebase.messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("On notification opened app");
      openerNotification = remoteMessage;
      const url = buildDeepLinkFromNotificationData(remoteMessage.data)
      if (typeof url === 'string') {
        listener(url, "test")
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
}

export default function Navigation() {
  const navigationState = useSelector(({ ApplicationStore }) => {
    return ApplicationStore.appScreenState;
  });

  useListenDeviceToken();
  const dispatch = useDispatch();

  const user = useUser();
  
  React.useEffect(
    () => {
      if(user == undefined){
        firebase.messaging().subscribeToTopic('stores-offline');
      }
    }, []
  );


  React.useEffect(
    () => {
      setInterval(
        async () => {
          try {

            console.log("getting apps params...");

            const appParams = await Daos.User.getAppParams();
            dispatch(updateAppParams(appParams));

          } catch (e) {

          } finally {

          }
        }, 300000
      )
    }, []
  );



  const CurrentNavigation = React.useMemo(() => {
    switch (navigationState) {
      case NAVIGATION_STATE_FIRST_LAUNCH:
        return <FirstLaunchScreen />;

      case NAVIGATION_STATE_NOT_CONNECTED:
        return (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="AuthNavigation" component={AuthNavigation} />

            <Stack.Screen name="CGUScreen" component={CGUScreen} />
            <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
          </Stack.Navigator>
        );

      default:
        return (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name="AuthNavigation"
              component={AuthenticatedNavigation}
            />

            <Stack.Screen name="CGUScreen" component={CGUScreen} />
            <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
          </Stack.Navigator>
        );
    }
  }, [navigationState]);

  return (
    // <GestureHandlerRootView>
    <NavigationContainer linking={linking}>{CurrentNavigation}</NavigationContainer>
    // </GestureHandlerRootView>
  );
}
