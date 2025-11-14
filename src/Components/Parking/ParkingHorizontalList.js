import React from 'react';
import {LargeText} from '../Globals/Texts';
import Carousel from 'react-native-reanimated-carousel';
import {Dimensions, Text, View, ActivityIndicator, FlatList} from 'react-native';
import ParkingHorizontalListItem from './ParkingHorizontalListItem';
import useDaoCall from '../../Hooks/useDaoCall';
import Daos from '../../Daos';

export default function ParkingHorizontalList() {
  const width = Dimensions.get('window').width;

  const {
    data: parkings,
    isLoading,
    errors,
    call: loadParkings,
  } = useDaoCall({
    daoCall: Daos.Parkings.index,
    onFinish(results) {
    },
  });

  React.useLayoutEffect(() => {
    loadParkings();
  }, []);

  return (
    <View>
      <LargeText fontFamily="bold" style={{marginVertical: 8}}>
        Point de parking
      </LargeText>
      {isLoading && <ActivityIndicator size="large" />}
      {!isLoading && !!parkings && (
        <FlatList 
          horizontal={true}
          style={{overflow: 'visible'}}
          data={parkings}
          renderItem={({item}) => {
              return (
                <ParkingHorizontalListItem parking={item} />
              )
          }}

        />

      )}
    </View>
  );
}
