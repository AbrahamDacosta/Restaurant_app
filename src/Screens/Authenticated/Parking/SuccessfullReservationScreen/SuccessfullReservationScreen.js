import React from 'react';
import {View} from 'react-native';
import { TitleText, CustomText, LargeText } from '../../../../Components/Globals/Texts';
import ContainerView from '../../../../Components/Globals/ContainerView';
import { AppButton } from '../../../../Components/Globals/Butttons';
import { useNavigation } from '@react-navigation/native';

export default function SuccessfullReservationScreen(){

    const navigation = useNavigation();

    return (
        <ContainerView style={{paddingTop: 0, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center'}}>
                <TitleText fontFamily="bold" style={{marginBottom: 16}}>Félicitation</TitleText>
                <LargeText fontFamily="bold">Réservation réussie</LargeText>
            </View>

            <AppButton onPress={()=>{
                navigation.goBack();
            }} style={{marginTop: 81, width: '75%'}}>Fermer</AppButton>

        </ContainerView>
    )
}