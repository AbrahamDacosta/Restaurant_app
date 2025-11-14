import React, {
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, Text, StyleSheet} from 'react-native';
import {LargeText} from '../../Globals/Texts';
import ContainerView from '../../Globals/ContainerView';
import {AppInput, DateInput, TimeInput} from '../../Globals/Inputs';
import {AppButton} from '../../Globals/Butttons';
import useDaoCall from '../../../Hooks/useDaoCall';
import Daos from '../../../Daos';
import * as Yup from 'yup';
import moment from 'moment';
import {useFormik} from 'formik';

const validationSchema = Yup.object().shape({
  date: Yup.string().required('Champs requis'),
  timeStart: Yup.string().required('Champs requis'),
  timeEnd: Yup.string().required('Champs requis'),
});

const ParkingReservationBottomSheet = forwardRef(function (
  {onClose, parking, selectedPlace, onPlaceSelected, onSearchReady},
  ref,
) {
  const bottomSheetRef = useRef(null);

  const [values, setValues] = React.useState();

  const {
    data: searchResult,
    isLoading,
    errors,
    call: loadStatus,
  } = useDaoCall({
    daoCall: Daos.Parkings.details,
    onFinish(results) {
      onSearchReady({results, searchParams: values});
      bottomSheetRef.current.close();

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

      loadStatus({
        parkingId: parking.id,
        start_date,
        end_date,
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

  React.useEffect(()=>{
    setValues(formik.values)
  }, [formik.values]);

  // variables
  const snapPoints = useMemo(() => ['1%', '55%'], []);

  useImperativeHandle(ref, () => {
    return {
      showSheet() {
        bottomSheetRef.current.expand();
      },
    };
  });


  return (
    <BottomSheet
      handleStyle={{
        borderWidth: 1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        borderColor: '#e2e2e0',
        borderRadius: 18,
        padding: 18,
      }}
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <ContainerView style={styles.contentContainer}>
        <LargeText fontFamily="bold" style={{marginBottom: 24}}>
          Temps d'occupation
        </LargeText>

        <DateInput
          onDateChange={time => {
            formik.handleChange('date')(time);
          }}
          error={formik.errors?.date}
          value={formik.values.date}
          label="Date"
        />

        <View style={{flexDirection: 'row'}}>
          <TimeInput
            error={formik.errors?.timeStart}
            onTimeChange={time => {
              formik.handleChange('timeStart')(time);
            }}
            value={formik.values.timeStart}
            containerStyle={{flex: 1}}
            label="De"
          />
          <View style={{width: 15}} />

          <TimeInput
            onTimeChange={time => {
              formik.handleChange('timeEnd')(time);
            }}
            error={formik.errors?.timeEnd}
            value={formik.values.timeEnd}
            containerStyle={{flex: 1}}
            label="A"
          />
        </View>
        <AppButton isLoading={isLoading} onPress={()=>{
          formik.submitForm()
        }}>Rechercher !</AppButton>
      </ContainerView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    paddingTop: 0,
    flex: 1,
  },
});

export default ParkingReservationBottomSheet;
