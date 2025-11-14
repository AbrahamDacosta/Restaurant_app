import React from 'react';
import ContainerView from '../../../../Components/Globals/ContainerView';
import {
  LargeText,
  LightText,
  CustomText,
} from '../../../../Components/Globals/Texts';
import {FlatList, TouchableOpacity, View} from 'react-native';
import ImageCard from '../../../../Components/Globals/ImageCard';
import {useRoute, useNavigation} from '@react-navigation/native';
import {etageToString} from '../../../../Utils/Helpers/Parking/ParkingHelper';

export default function ParkingSearchResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const results = route.params.results;
  const {date, timeStart, timeEnd} = route.params.search;

  return (
    <ContainerView style={{paddingTop: 0}}>
      <LargeText fontFamily="bold" style={{}}>
        Liste
      </LargeText>

      <FlatList
        data={results}
        renderItem={item => {
          return (
            <ResultItem
              onPress={() => {
                navigation.navigate('ParkingReservationScreen', {
                  place: item.item,
                  date,
                  timeStart,
                  timeEnd,
                });
              }}
              parkingPlace={item.item}
            />
          );
        }}
      />
    </ContainerView>
  );
}

function ResultItem({parkingPlace, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flexDirection: 'row', marginVertical: 8}}>
      <ImageCard />

      <View
        style={{
          flex: 1,
          paddingLeft: 8,
          paddingRight: 8,
          justifyContent: 'center',
        }}>
        <CustomText style={{fontSize: 15}}>
          {etageToString(parkingPlace.etage_number)}
        </CustomText>
        <LightText style={{fontSize: 15}}>
          {parkingPlace.parking_label}
        </LightText>
      </View>

      <View style={{justifyContent: 'center'}}>
        <LightText style={{}}>Libre</LightText>
      </View>
    </TouchableOpacity>
  );
}
