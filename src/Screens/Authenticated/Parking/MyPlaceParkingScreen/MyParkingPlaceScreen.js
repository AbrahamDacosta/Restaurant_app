import React from 'react';
import {View, ScrollView} from 'react-native';
import ParkingView from '../../../../Components/Parking/ParkingView';
import ContainerView from '../../../../Components/Globals/ContainerView';
import { DateInput, TimeInput } from '../../../../Components/Globals/Inputs';
import {useRoute} from '@react-navigation/native';
import { LargeText } from '../../../../Components/Globals/Texts';

export default function MyParkingPlaceScreen() {

    const route = useRoute();

    const {place, date, timeStart, timeEnd} = route.params || {place : {id: 3, etage_number: 1, place: 8}, date: '2022-01-01', timeStart: '22:00', timeEnd: '23:00'};
  return (
    <ScrollView>
      <ContainerView>
        <ParkingView
          onParkingItemPicked={({place, etage}) => {}}
          etageNumber={4}
          activePlace={place}
          usedPlacesByEtages={{}}
        />

        <LargeText fontFamily="bold" style={{marginTop: 8}}>Temps d'occupation</LargeText>

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

      </ContainerView>
      
    </ScrollView>
  );
}
