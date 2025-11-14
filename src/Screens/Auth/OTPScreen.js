import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ContainerView from '../../Components/Globals/ContainerView';
import {LightText, TitleText} from '../../Components/Globals/Texts';
import {AppInput, AuthInput} from '../../Components/Globals/Inputs';
import {
  AppButton,
  GrayButton,
  TextButton,
} from '../../Components/Globals/Butttons';
import {useNavigation} from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <ContainerView style={{backgroundColor: 'white', flex: 1}}>
      <Image
        resizeMode="contain"
        style={{
          resizeMode: 'contain',
          height: undefined,
          width: undefined,
          flex: 7 / 8,
        }}
        source={require('assets/images/auth_art.png')}
      />

      <TitleText>Connexion</TitleText>

      <AuthInput style={{padding: 0}} placeholder="Email/ID" />

      <AuthInput
        secureTextEntry={true}
        style={{padding: 0}}
        placeholder="Mot de passe"
      />

      <View style={{alignItems: 'flex-end'}}>
        <TextButton>Mot de passe oublié</TextButton>
      </View>

      <AppButton
        style={{
          marginTop: 18,
        }}>
        Connexion
      </AppButton>

      <LightText style={{marginVertical: 18, alignSelf: 'center'}}>
        OU
      </LightText>

      <GrayButton style={{}}>Se connecter avec Google</GrayButton>

      <View
        style={{
          marginTop: 16,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <LightText style={{marginRight: 4}}>Pas de compte ?</LightText>
        <TextButton onPress={() => navigation.navigate('Auth.SignupScreen')}>
          S'inscrire
        </TextButton>
      </View>
    </ContainerView>
  );
}
