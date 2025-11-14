import React from 'react';
import { View, Spinner, CircularProgress } from 'react-native';
import Navigation from './Navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider as ReduxProvider } from 'react-redux';
import store, { persistor } from './Store';
import { CustomText } from './Components/Globals/Texts';
import axios from 'axios';
import { ActivityIndicator } from 'react-native'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { PermissionsAndroid } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import Daos from './Daos';
import { deconnectUser, setToken } from './Store/ApplicationStore';

const queryClient = new QueryClient()


axios.interceptors.request.use(req => {
  const userToken = store.getState().ApplicationStore?.token;

  if (userToken) req.headers.Authorization = `Bearer ${userToken.token}`;

  req.headers.Accept = `application/json`;


  return req;
});


axios.interceptors.response.use(async (response) => {

  const userToken = store.getState().ApplicationStore?.token;
  
  const originalRequest = response.config;
  if (response?.data.error == "Token incorrect" && !originalRequest._retry) {
    originalRequest._retry = true;
    const access_token = await Daos.Auth.refreshToken(userToken.refreshToken);
    console.log("new token => ", response.config.url, access_token, userToken.refreshToken);

    if(access_token.error != undefined){
      
      store.dispatch(deconnectUser())
      return access_token;
    }

    let newParams = {
      ...(originalRequest.params || {}),
      chaine: access_token.token,
      token: access_token.token
    };

    originalRequest.params = newParams;
    store.dispatch(setToken(access_token))

    
    return axios(originalRequest);
  }

  return response
});


const App = function () {

  React.useEffect(() => {
    // alert("Here");
    requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
      // …
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, }}>
        <ReduxProvider store={store}>
          <PersistGate persistor={persistor} loading={(
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size={'large'} />
            </View>
          )}>
            {/*<SafeAreaProvider>*/}
            {/*<SafeAreaView>*/}
            <Navigation />
            {/*</SafeAreaView>*/}
            {/*</SafeAreaProvider>*/}
          </PersistGate>
        </ReduxProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;
