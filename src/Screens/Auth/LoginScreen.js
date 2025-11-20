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
import { CustomText, LightText, TitleText } from '../../Components/Globals/Texts';
import { AppInput, AuthInput } from '../../Components/Globals/Inputs';
import {
  AppButton,
  GrayButton,
  TextButton,
} from '../../Components/Globals/Butttons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { connectUser } from '../../Store/ApplicationStore';
import Daos from '../../Daos';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useDaoCall from '../../Hooks/useDaoCall';
import { PRIMARY_COLOR, BACKGROUND_DARK, TEXT_WHITE } from '../../Theme/Theme';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Champs requis'),
  password: Yup.string().required('Champs requis'),
});

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    data: loginResult,
    isLoading,
    errors,
    call: loginUser,
  } = useDaoCall({
    daoCall: Daos.Auth.login,
    onFinish({ user, token }) {
      console.log("before connexion ", user, token);
      dispatch(connectUser({ user, token }));
    },
    onError(error) {
      console.log("Some error happened", error.response.data);
    }
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit(values) {
      loginUser(values);
    },
    onError(e) {
      console.log(e);
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });


  return (
    <ContainerView style={{ backgroundColor: BACKGROUND_DARK, flex: 1 }}>

      <TitleText style={{ color: TEXT_WHITE }} fontFamily="bold">Application Partenaire</TitleText>

      <Image
        resizeMode="contain"
        style={{
          resizeMode: 'contain',
          height: undefined,
          width: undefined,
          flex: 6 / 8,
        }}
        source={require('assets/images/logo.png')}
      />

      <View style={{ marginBottom: 24 }}>
        <TitleText style={{ marginBottom: -12, color: TEXT_WHITE }} fontFamily="bold">Connexion</TitleText>
        {
          (errors && errors.response?.data.error != undefined) && (
            <CustomText style={{ color: 'red', marginTop: 4 }}>{errors.response.data.error}</CustomText>
          )
        }

        {
          (errors && !errors.response) && (
            <CustomText style={{ color: 'red', marginTop: 4 }}>Impossible de se connecter au serveur.{'\n'}Vérifiez votre connexion à internet.</CustomText>
          )
        }
      </View>

      <AuthInput
        onChangeText={value => {
          formik.handleChange('email')(value);
        }}
        label="Email/ID"
        style={{ padding: 0 }}
        placeholder="Email/ID"
        error={formik?.errors.email}
        value={formik.values.email}
      />

      <AuthInput
        label="Mot de passe"
        error={formik?.errors.password}
        secureTextEntry={true}
        style={{ padding: 0 }}
        value={formik.values.password}
        onChangeText={value => {
          formik.handleChange('password')(value);
        }}
        placeholder="Mot de passe"
      />

      <View style={{ alignItems: 'flex-end' }}>
        <TextButton>Mot de passe oublié</TextButton>
      </View>

      <AppButton
        isLoading={isLoading}
        onPress={() => {
          formik.submitForm();
        }}
        style={{
          marginTop: 18,
        }}>
        Connexion
      </AppButton>
      {/* 
      <LightText style={{marginVertical: 18, alignSelf: 'center'}}>
        OU
      </LightText> */}

      {/* <GrayButton style={{}}>Se connecter avec Google</GrayButton> */}
      {/* 
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
      </View> */}
    </ContainerView>
  );
}
