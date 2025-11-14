import React from 'react';
import {View, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

const Stack = createStackNavigator();

export default function AuthNavigation() {
  return (
    <>
    <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
<Stack.Navigator screenOptions={{
      headerShown: false
    }} >
      <Stack.Screen name={'Auth.LoginScreen'} component={LoginScreen} />
      <Stack.Screen name={'Auth.SignupScreen'} component={SignupScreen} />
    </Stack.Navigator>
    </>
  );
}
