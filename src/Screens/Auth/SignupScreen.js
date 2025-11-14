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
import {CustomText, LightText, TitleText} from '../../Components/Globals/Texts';
import {AppInput, AuthInput} from '../../Components/Globals/Inputs';
import {
  AppButton,
  GrayButton,
  TextButton,
} from '../../Components/Globals/Butttons';
import {PRIMARY_COLOR} from '../../Theme/Theme';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useDaoCall from '../../Hooks/useDaoCall';
import Daos from '../../Daos';
import { useDispatch } from 'react-redux';
import { connectUser } from '../../Store/ApplicationStore';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Champs requis'),
  noms: Yup.string().required('Champs requis'),
  password: Yup.string().required('Champs requis'),
});

export default function Signup() {

  const navigation = useNavigation();
  const dispatch = useDispatch();


  const {
    data: loginResult,
    isLoading,
    errors,
    call: registerUser,
  } = useDaoCall({
    daoCall: Daos.Auth.register,
    onFinish({user, token}) {
      dispatch(connectUser({user, token}));
    },
  });


  const formik = useFormik({
    initialValues: {
      email: '',
      noms: '',
      password: '',
    },
    onSubmit(values) {
      registerUser(values)
    },
    onError(e) {

    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });

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

      <View style={{marginBottom: 24}}>
        <TitleText style={{marginBottom: -12}} fontFamily="bold">Inscription</TitleText>
        {
          (errors && errors.response?.status == 400 && errors.response.data) && (
            <CustomText style={{color: 'red', marginTop: 4}}>{errors.response.data.map(item => item.message).join(', ')}</CustomText>
          )
        }

        {
          (errors && !errors.response) && (
            <CustomText style={{color: 'red', marginTop: 4}}>Impossible de se connecter au serveur.{'\n'}Vérifiez votre connexion à internet.</CustomText>
          )
        }
      </View>

      <AuthInput
        onChangeText={value => {
          formik.handleChange('email')(value);
        }}
        label="Email/ID"
        style={{padding: 0}}
        placeholder="Email/ID"
        error={formik?.errors.email}
        value={formik.values.email}
      />

      <AuthInput
        onChangeText={value => {
          formik.handleChange('noms')(value);
        }}
        label="Nom complet"
        style={{padding: 0}}
        placeholder="Nom complet"
        error={formik?.errors.noms}
        value={formik.values.noms}
      />

      <AuthInput
        label="Mot de passe"
        error={formik?.errors.password}
        secureTextEntry={true}
        style={{padding: 0}}
        value={formik.values.password}
        onChangeText={value => {
          formik.handleChange('password')(value);
        }}
        placeholder="Mot de passe"
      />

      <LightText style={{marginRight: 4, textAlign: 'center', marginTop: 16}}>
        En vous Inscrivant vous acceptez{' '}
        <CustomText onPress={()=>{
          navigation.navigate('CGUScreen')
        }} style={{color: PRIMARY_COLOR}}>
          nos conditions d'utilisations
        </CustomText>{' '}
        et{' '}
        <CustomText onPress={
          ()=>{
            navigation.navigate('PolicyScreen')
          }
        } style={{color: PRIMARY_COLOR}}>
          Politiques de confidentialités
        </CustomText>
      </LightText>
      <AppButton
      isLoading={isLoading}
      onPress={()=>{
        formik.submitForm();
      }}
        style={{
          marginTop: 18,
        }}>
        S'inscrire
      </AppButton>

      <LightText style={{marginRight: 4, textAlign: 'center', marginTop: 16}}>
        Déja un compte ?{' '}
        <CustomText onPress={
          () => navigation.navigate('Auth.LoginScreen')
        } style={{color: PRIMARY_COLOR}}>
          Se connecter
        </CustomText>
      </LightText>

    </ContainerView>
  );
}
