import React from 'react';
import {View} from 'react-native';
import { BACKGROUND_DARK } from '../../Theme/Theme';

export default function ContainerView(props) {
  return (
    <View {...props} style={{flex: 1, paddingHorizontal: 24, paddingTop: 27, overflow: 'visible', backgroundColor: BACKGROUND_DARK,...props.style,}}>
      {props.children}
    </View>
  );
}
