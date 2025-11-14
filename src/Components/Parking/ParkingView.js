import React from 'react';
import {View, FlatList, Image} from 'react-native';
import {CustomText, LargeText, LightText} from '../Globals/Texts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  PLACE_CHOISIE,
  PLACE_OCCUPE,
  getParkingPlaceMap,
} from '../../Utils/Helpers/Parking/ParkingHelper';
import {Dimensions} from 'react-native';
import {DEFAULT_BORDER_COLOR, PRIMARY_COLOR} from '../../Theme/Theme';

export default function ParkingView(props) {
  const {etageNumber, onParkingItemPicked, usedPlacesByEtages, activePlace, initialEtage} = props;
  const [activeEtage, setActiveEtage] = React.useState(activePlace?.etage_number || 0);

  const usedPlaces = React.useMemo(() => {
    if (usedPlacesByEtages && usedPlacesByEtages[activeEtage])
      return usedPlacesByEtages[activeEtage];
    return [];
  }, [usedPlacesByEtages, activeEtage]);

  return (
    <View style={{overflow: 'visible'}}>
      <LargeText fontFamily="bold">Etage</LargeText>

      <FlatList
        style={{padding: 8, overflow: 'visible'}}
        horizontal={true}
        data={[...new Array(etageNumber || 4).keys()]}
        renderItem={item => {
          return (
            <ParkingEtageItem
              onPress={() => {
                setActiveEtage(item.item);
              }}
              active={activeEtage == item.item}
              etageNumber={item.item + 1}
            />
          );
        }}
      />

      <ParkingPlaces onPlacePicked={(place)=>{
                if (onParkingItemPicked)
                  onParkingItemPicked({
                    etage: activeEtage,
                    place: place,
                  });
      }} usedPlaces={usedPlaces} activePlace={activeEtage == activePlace?.etage_number ? activePlace.place : undefined } />

    </View>
  );
}

function ParkingPlaces({placeNumber, activePlace, usedPlaces, onPlacePicked}) {
  const places = getParkingPlaceMap(usedPlaces, activePlace, placeNumber || 20);
  const width = Dimensions.get('window').width - 48;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}>
        {places.map((place, index) => {
          const hasSpacing = (index + 1) % 2 == 0 && (index + 1) % 4 != 0;
          const disabled = usedPlaces.includes(index + 1);

          let Component = PlaceLibreImage;

          if (place == PLACE_CHOISIE) Component = PlaceChoisieImage;
          else if (place == PLACE_OCCUPE) Component = PlaceOccupeImage;


          return (
            <TouchableOpacity
              disabled={disabled}
              style={{
                width: width / 4,
                alignItems: 'center',
                marginVertical: 6,
              }}
              key={index}
              onPress={() => {
                onPlacePicked(index + 1)
              }}>
              <View
                style={{
                  height: width / 4 - 8,
                  width: width / 4 - 8,
                  backgroundColor: '#fafafa',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor:
                    place == PLACE_CHOISIE
                      ? PRIMARY_COLOR
                      : DEFAULT_BORDER_COLOR,
                }}>
                <Component style={{}} />
                <LightText style={{position: 'absolute', bottom: 0, left: 4}}>
                  {(index + 1).toString().padStart(2, '0')}
                </LightText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function PlaceLibreImage(props) {
  return null;
}

function PlaceOccupeImage(props) {
  return (
    <Image
      style={{
        ...props.style,
        resizeMode: 'contain',
        height: '100%',
        width: '100%',
      }}
      resizeMode={'contain'}
      source={require('assets/images/car_place.png')}
    />
  );
}

function PlaceChoisieImage(props) {
  return (
    <Image
      resizeMode={'contain'}
      style={{
        ...props.style,
        resizeMode: 'contain',
        height: '100%',
        width: '100%',
      }}
      source={require('assets/images/my_place.png')}
    />
  );
}

function ParkingEtageItem({etageNumber, active, onPress}) {
  const etageLabel = React.useMemo(() => {
    if (etageNumber == 1) return 'Rez-de-chaussée';
    else if (etageNumber == 2) return '1er étage';

    return `${etageNumber}e étage`;
  }, [etageNumber]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: '#707070',
        borderWidth: 1,
        minWidth: 115,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginRight: 8,
        backgroundColor: active ? 'black' : 'transparent',
      }}>
      <LightText>{etageLabel}</LightText>
    </TouchableOpacity>
  );
}
