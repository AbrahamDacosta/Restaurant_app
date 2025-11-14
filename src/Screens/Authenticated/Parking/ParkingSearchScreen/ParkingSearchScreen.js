import React from 'react';
import {TouchableOpacity} from 'react-native';
import ContainerView from '../../../../Components/Globals/ContainerView';
import {CustomText, LargeText} from '../../../../Components/Globals/Texts';
import {DateInput, TimeInput} from '../../../../Components/Globals/Inputs';
import {AppButton} from '../../../../Components/Globals/Butttons';
import CheckBox from '@react-native-community/checkbox';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import useDaoCall from '../../../../Hooks/useDaoCall';
import Daos from '../../../../Daos';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const validationSchema = Yup.object().shape({
  date: Yup.string().required('Champs requis'),
  timeStart: Yup.string().required('Champs requis'),
  timeEnd: Yup.string().required('Champs requis'),
});

export default function ParkingSearchScreen() {
  const [form, setForm] = React.useState({
    date: undefined,
    timeStart: undefined,
    timeEnd: undefined,
    freeSoon: false,
  });

  const navigation = useNavigation();

  const {
    data: searchResult,
    isLoading,
    errors,
    call: searchParking,
  } = useDaoCall({
    daoCall: Daos.Parkings.search,
    onFinish(results) {
      console.log(results.length);
    },
  });

  const formik = useFormik({
    initialValues: {
      date: '',
      timeStart: '',
      timeEnd: '',
    },

    onSubmit(values) {
      const start_date = `${values.date}T${values.timeStart}`;
      const end_date = `${values.date}T${values.timeEnd}`;

      console.log('start date', start_date, end_date);

      searchParking({
        start_date,
        end_date,
        etage: 1,
        freeSoon: false,
      });
    },
    onError(e) {
      console.log(e);
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });

  React.useEffect(() => {
    if (searchResult) {
      navigation.navigate('ParkingSearchResultScreen', {
        results: searchResult,
        search: formik.values,
      });
    }
  }, [searchResult, formik.values]);

  console.log('values', formik.values, formik.errors);

  return (
    <ContainerView style={{paddingTop: 0}}>
      <LargeText
        fontFamily="bold"
        style={{marginVertical: 8, marginBottom: 16}}>
        Critères de recherche
      </LargeText>

      <DateInput
        onDateChange={time => {
          formik.handleChange('date')(time);
        }}
        error={formik.errors?.date}
        containerStyle={{marginVertical: 8}}
        value={formik.values.date}
        label="Date de reservation"
        placeholder="Date de reservation"
      />

      <TimeInput
        error={formik.errors?.timeStart}
        onTimeChange={time => {
          formik.handleChange('timeStart')(time);
        }}
        containerStyle={{marginVertical: 8}}
        value={formik.values.timeStart}
        label="A partir de"
        placeholder="A partir de"
      />

      <TimeInput
        error={formik.errors?.timeEnd}
        onTimeChange={time => {
          formik.handleChange('timeEnd')(time);
        }}
        containerStyle={{marginVertical: 8}}
        value={formik.values.timeEnd}
        label="Jusqu'à"
        placeholder="Jusqu'à"
      />

      <TouchableOpacity
        onPress={() => {}}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox value={form.freeSoon} />
        <CustomText>Se liberant bientôt</CustomText>
      </TouchableOpacity>

      <AppButton
        onPress={() => {
          formik.submitForm();
        }}
        isLoading={isLoading}
        style={{marginTop: 24}}>
        Rechercher
      </AppButton>
    </ContainerView>
  );
}
