import React from 'react';
import ContainerView from '../../../../Components/Globals/ContainerView';
import {LargeText, LightText} from '../../../../Components/Globals/Texts';
import {DEFAULT_BORDER_COLOR} from '../../../../Theme/Theme';
import {View, Image} from 'react-native';
import { DateInput, TimeInput } from '../../../../Components/Globals/Inputs';
import { AppButton } from '../../../../Components/Globals/Butttons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { etageToString } from '../../../../Utils/Helpers/Parking/ParkingHelper';
import useDaoCall from '../../../../Hooks/useDaoCall';
import Daos from '../../../../Daos';

export default function ParkingReservationScreen() {

    const route = useRoute();
    const navigation = useNavigation();
    const {place, date, timeStart, timeEnd} = route.params || {place : {id: 3, etage_number: 0, place: 3}, date: '2022-01-01', timeStart: '22:00', timeEnd: '23:00'};


  const {
    data: reservationResult,
    isLoading,
    errors,
    call: makeReservation,
  } = useDaoCall({
    daoCall: Daos.Parkings.makeReservation,
    onFinish(result) {
        navigation.reset({
            index: 1,
            routes: [
              {
                name: 'HomeTabNavigator',
              },
              {
                name: 'SuccessfullReservationScreen',
              },
            ],
          });
    },
  });


  return (
    <ContainerView style={{paddingTop: 0}}>
      <LargeText fontFamily="bold" style={{marginBottom: 16}}>
        Parking - <LightText>{place.parking_label}</LightText>
      </LargeText>

      <View style={{flexDirection: 'row', alignItems: 'center',}}>
        <View
          style={{
            height: 96,
            width: 96,
            backgroundColor: '#fafafa',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: DEFAULT_BORDER_COLOR,
          }}>
          <Image
            style={{
              resizeMode: 'contain',
              height: '100%',
              width: '100%',
            }}
            resizeMode={'contain'}
            source={require('assets/images/car_place.png')}
          />
          <LightText style={{position: 'absolute', bottom: 0, left: 4}}>
            {(place.place).toString().padStart(2, '0')}
          </LightText>
        </View>

        <View style={{marginLeft: 16}}>
            <LightText>Place {(place.place).toString().padStart(2, '0')}</LightText>
            <LargeText>{etageToString(place.etage_number)}</LargeText>
        </View>

      </View>

        <DateInput value={date} disabled={true} label="Date" placeholder="Date" />

        <View style={{flexDirection: 'row'}}>
          <TimeInput
            containerStyle={{flex: 1}}
            value={timeStart}
            label="De"
          />
          <View style={{width: 15}} />

          <TimeInput
value={timeEnd}
            containerStyle={{flex: 1}}
            label="A"
          />
        </View>

        <AppButton onPress={() => {
            makeReservation({
                start_date: `${date} ${timeStart}`, end_date: `${date} ${timeEnd}`, place: place.id
            });
        }} isLoading={isLoading} style={{marginTop: 16}}>
            Valider
        </AppButton>

    </ContainerView>
  );
}
