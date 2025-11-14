import React from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {LargeText} from '../Globals/Texts';
import ParkingHistoryItem from './History/ParkingHistoryItem';
import useDaoCall from '../../Hooks/useDaoCall';
import Daos from '../../Daos';
import { useFocusEffect } from '@react-navigation/native';

export default function RecentParkingList() {
  const {
    data: reservationResult,
    isLoading,
    errors,
    call: loadHistory,
  } = useDaoCall({
    daoCall: Daos.Parkings.reservationHistory,
    onFinish(result) {},
  });


  useFocusEffect(
    React.useCallback(() => {
      loadHistory()
    }, [])
  );

  return (
    <View style={{flex: 1, paddingTop: 16}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <LargeText style={{flex: 1}} fontFamily="bold">
          Vos récents point de parking
        </LargeText>
        {isLoading && <ActivityIndicator size={'small'} />}
      </View>

      {reservationResult && (
        <FlatList
          data={reservationResult}
          renderItem={item => <ParkingHistoryItem reservation={item.item} />}
        />
      )}
    </View>
  );
}
