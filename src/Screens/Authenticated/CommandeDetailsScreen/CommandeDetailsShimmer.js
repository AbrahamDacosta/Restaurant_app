import React from 'react';
import { View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

export default function CommandeDetailsShimmer(){

    return (
        <View style={{flex: 1, padding: 16}}>
            <ShimmerPlaceholder shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} style={{width: '100%', height: 92, opacity: 0.4, borderRadius: 12, marginVertical: 12}} />
            <ShimmerPlaceholder shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} style={{width: '100%', height: 92, opacity: 0.4, borderRadius: 12, marginVertical: 12}} />
            <ShimmerPlaceholder shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} style={{width: '100%', height: 92, opacity: 0.4, borderRadius: 12, marginVertical: 12}} />
            
            <ShimmerPlaceholder shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} style={{width: '100%', height: 92, opacity: 0.4, borderRadius: 12, marginVertical: 12, flex: 1}} />

        </View>
    )
}