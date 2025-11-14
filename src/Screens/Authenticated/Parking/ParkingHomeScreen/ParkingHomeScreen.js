import React from 'react';
import {View} from 'react-native';
import ParkingView from '../../../../Components/Parking/ParkingView';
import ContainerView from '../../../../Components/Globals/ContainerView';
import ParkingReservationBottomSheet from '../../../../Components/Parking/ParkingReservation/ParkingReservationBottomSheet';
import {LargeText} from '../../../../Components/Globals/Texts';
import {AppInput} from '../../../../Components/Globals/Inputs';
import {useRoute, useNavigation} from '@react-navigation/native';
import useDaoCall from '../../../../Hooks/useDaoCall';
import Daos from '../../../../Daos';
import {TextButton} from '../../../../Components/Globals/Butttons';

export default function ParkingHomeScreen() {
  const navigation = useNavigation();
  const parkingReservationRef = React.useRef(null);
  const route = useRoute();
  const parking = route.params.parking;

  const [searchResult, setSearchResult] = React.useState();

  const placeByEtages = React.useMemo(() => {
    if (!searchResult) return;


    return searchResult.results.occupedPlaces.reduce((accumulator, item) => {
      accumulator[item.etage_number] = [
        ...(accumulator[item.etage_number] || []),
        item.place,
      ];
      return accumulator;
    }, {});
  }, [searchResult]);
  
  const allPlaceByEtages = React.useMemo(() => {
    if (!searchResult) return;

    return searchResult.results.occupedPlaces.reduce((accumulator, item) => {
      accumulator[item.etage_number] = [
        ...(accumulator[item.etage_number] || []),
        item,
      ];
      return accumulator;
    }, {});
  }, [searchResult]);

  const {
    data: parkingDetails,
    isLoading,
    errors,
    call: loadDetails,
  } = useDaoCall({
    daoCall: Daos.Parkings.details,
    onFinish(results) {
    },
  });

  React.useLayoutEffect(() => {
    loadDetails();
  }, []);

  return (
    <ContainerView style={{backgroundColor: 'white', flex: 1, paddingTop: 0}}>
      <LargeText fontFamily="bold">Place de Parking</LargeText>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AppInput
          placeholder={parking.label}
          containerStyle={{flex: 1}}
          disabled
        />
        <TextButton
          onPress={() => {
            parkingReservationRef.current.showSheet();
          }}>
          Rechercher !
        </TextButton>
      </View>

      <ParkingView
        onParkingItemPicked={({place, etage}) => {
          if (searchResult) {
            const parkingModel = searchResult.results.freePlaces.find(item => item.etage_number == etage && item.place == place);
            navigation.navigate('ParkingReservationScreen', {
              place: parkingModel,
              date: searchResult.searchParams.date,
              timeStart: searchResult.searchParams.timeStart,
              timeEnd: searchResult.searchParams.timeEnd,
            });
          }
        }}
        etageNumber={4}
        usedPlacesByEtages={placeByEtages}
      />
      <ParkingReservationBottomSheet
        onSearchReady={setSearchResult}
        parking={parking}
        ref={parkingReservationRef}
      />
    </ContainerView>
  );
}
