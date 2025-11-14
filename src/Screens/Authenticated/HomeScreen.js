import React from 'react';
import {TouchableOpacity, View} from 'react-native'
import { CustomText, LargeText, LightText, TitleText } from '../../Components/Globals/Texts';
import ContainerView from '../../Components/Globals/ContainerView';
import ImageCard from '../../Components/Globals/ImageCard';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SearchInput from '../../Components/Utils/SearchInput';
import ParkingHorizontalList from '../../Components/Parking/ParkingHorizontalList';
import RecentParkingList from '../../Components/Parking/RecentParkingList';
import useUser from '../../Hooks/useUser';

export default function HomeScreen(){

    const user = useUser();


    return (
        <ContainerView style={{flex: 1}}>

            <View style={{flexDirection: 'row'}}>
                <View>
                    <ImageCard />
                </View>
                <View style={{flex: 1, paddingLeft: 8}}>
                    <LargeText fontFamily='bold' style={{}}>Hello, {user.noms}</LargeText>
                    <LightText style={{fontSize: 18}}>Ou voulez vous garer ?</LightText>
                </View>
                <TouchableOpacity>
                    <Fontisto size={36} name="bell" />
                </TouchableOpacity>
            </View>

            <SearchInput style={{marginTop: 16}} />

            <ParkingHorizontalList />

            <RecentParkingList />

        </ContainerView>
    )
}