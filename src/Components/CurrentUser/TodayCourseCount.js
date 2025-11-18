import React from 'react';
import { Text, View } from 'react-native';
import { CustomText } from '../Globals/Texts';
import { moderateScale } from '../../Utils/Helpers/ResponsiveHelper';


export default function TodayCourseCount() {


    return (
        <View style={{alignItems: 'center'}}>
            <View style={{ height: 72, width: 72, borderWidth: 1, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                <CustomText fontFamily="bold" style={{ fontSize: moderateScale(36, 0.3) }}>15</CustomText>
            </View>
            <CustomText>Voyages Aujourd'hui</CustomText>
        </View>
    )
}