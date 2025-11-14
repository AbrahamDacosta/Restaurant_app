import React from 'react';
import { Text, View } from 'react-native';
import { CustomText } from '../Globals/Texts';


export default function MoyenneEvaluation() {

    return (
        <View style={{alignItems: 'center'}}>
            <View style={{ height: 72, width: 72, borderWidth: 1, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                <CustomText fontFamily="bold" style={{ fontSize: 36 }}>15</CustomText>
            </View>
            <CustomText>Moyenne évaluation</CustomText>
        </View>
    )
}