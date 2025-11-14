import React from 'react';
import {View, Image} from 'react-native'

import { CustomText } from './Texts';

export default function ImageCard(){

    return (
        <Image style={{height: 53, width: 53, borderRadius: 10}} source={{uri: 'https://d1gymyavdvyjgt.cloudfront.net/drive/images/uploads/headers/ws_cropper/1_0x0_790x520_0x520_bay_parking_guide.jpg'}} />
    )
}