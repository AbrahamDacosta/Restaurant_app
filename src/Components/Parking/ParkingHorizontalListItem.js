import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native'
import { CustomText } from '../Globals/Texts';
import { useNavigation } from '@react-navigation/native';

export default function ParkingHorizontalListItem({parking}){

    const navigation = useNavigation();
    

    return (
        <TouchableOpacity onPress={()=>{
            navigation.navigate('ParkingHomeScreen', {parking});
        }} style={{
            height: 96,
            width: 96,
            marginRight: 8,
            borderRadius: 10,
            borderColor: '#d8d8d8',
            borderWidth: 1,
            overflow: 'hidden'
        }}>

            {/* <Image style={{height: '100%', width: '100%', resizeMode: 'cover'}} source={{uri: 'https://d1gymyavdvyjgt.cloudfront.net/drive/images/uploads/headers/ws_cropper/1_0x0_790x520_0x520_bay_parking_guide.jpg'}} /> */}

            <View style={{height: '100%', width: '100%', backgroundColor: 'rgba(200, 200, 200, 0.5)', position: 'absolute', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8}}>
            <CustomText style={{fontSize: 10}}>{parking.label}</CustomText>
            <CustomText>A proximité</CustomText>

            </View>


        </TouchableOpacity>
    );
}