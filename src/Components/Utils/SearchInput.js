import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TextInput, TouchableOpacity} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto'

export default function SearchInput(props){

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={()=>{
            navigation.navigate('ParkingSearchScreen');
        }} style={{borderWidth: 1, borderRadius: 10, borderColor: '#d8d8d8', flexDirection: 'row', alignItems: 'center', paddingLeft: 20, ...props.style}}>
            <Fontisto size={18} color="#464455" style={{paddingRight: 16}} name="zoom" />
            <TextInput editable={false} placeholder='Recherchez le point de parking' />
        </TouchableOpacity>
    );
}