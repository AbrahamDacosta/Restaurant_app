import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ImageCard from '../../Globals/ImageCard';
import { CustomText, LightText } from '../../Globals/Texts';
import moment from 'moment'
import { useNavigation } from '@react-navigation/native';

export default function ParkingHistoryItem({reservation}){

    const navigation = useNavigation()

    const {timeStart, timeEnd, date} = React.useMemo(
        () => {
            return {
                timeStart: moment(reservation.start_date).format('HH:mm'),
                timeEnd: moment(reservation.end_date).format('HH:mm'),
                date: moment(reservation.start_date).format('YYYY-MM-DD')
            }
        }, [reservation]
    );

    return (
        <TouchableOpacity onPress={()=>{
            navigation.navigate(
                'MyParkingPlaceScreen', {
                    place: reservation,
                    timeStart, timeEnd,  date
                }
            )
        }} style={{flexDirection: 'row', marginVertical: 8}}>
            
        <ImageCard />

        <View style={{flex: 1, paddingLeft: 8, justifyContent: 'center'}}>
            <CustomText style={{fontSize: 15}}>{reservation.parking_label}</CustomText>
            <LightText style={{fontSize: 15}}>500 FCFA</LightText>
        </View>

        <View style={{justifyContent: 'center'}}>
            <LightText style={{}}>{timeStart}</LightText>
            <LightText style={{}}>{timeEnd}</LightText>
        </View>

        </TouchableOpacity>
    );
}