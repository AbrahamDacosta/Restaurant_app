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
    <ScrollView
      style={{ flex: 1, backgroundColor: BACKGROUND_DARK }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled">
      <ContainerView style={styles.container}>

        <View style={styles.headerSection}>
          <TitleText style={styles.appTitle} fontFamily="bold">Fakodrop</TitleText>
          <CustomText style={styles.subtitle}>Application Partenaire</CustomText>
        </View>

        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('assets/images/logo.png')}
          />
        </View>

        <View style={styles.formSection}>
          <View style={styles.formHeader}>
            <TitleText style={styles.formTitle} fontFamily="bold">Connexion</TitleText>
            {
              (errors && errors.response?.data.error != undefined) && (
                <View style={styles.errorContainer}>
                  <CustomText style={styles.errorText}>{errors.response.data.error}</CustomText>
                </View>
              )
            }

            {
              (errors && !errors.response) && (
                <View style={styles.errorContainer}>
                  <CustomText style={styles.errorText}>Impossible de se connecter au serveur.{'\n'}Vérifiez votre connexion à internet.</CustomText>
                </View>
              )
            }
          </View>

          <AuthInput
            onChangeText={value => {
              formik.handleChange('email')(value);
            }}
            label="Email/ID"
            style={{ padding: 0 }}
            placeholder="Entrez votre email ou ID"
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
            placeholder="Entrez votre mot de passe"
          />

          <View style={styles.forgotPasswordContainer}>
            <TextButton>Mot de passe oublié ?</TextButton>
          </View>

          <AppButton
            isLoading={isLoading}
            onPress={() => {
              formik.submitForm();
            }}
            style={styles.loginButton}>
            Connexion
          </AppButton>
        </View>

      </ContainerView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_DARK,
    flex: 1,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  appTitle: {
    color: PRIMARY_COLOR,
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    color: TEXT_WHITE,
    fontSize: 16,
    opacity: 0.8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: '80%',
    height: 200,
  },
  formSection: {
    flex: 1,
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    color: TEXT_WHITE,
    fontSize: 28,
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 77, 77, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    lineHeight: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  loginButton: {
    marginTop: 24,
  },
});
