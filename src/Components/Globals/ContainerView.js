import React from 'react';
import {View} from 'react-native';

export default function ContainerView(props) {
  return (
    <View {...props} style={{flex: 1, paddingHorizontal: 24, paddingTop: 27, overflow: 'visible', backgroundColor: 'white',...props.style,}}>
      {props.children}
    </View>
  );
}
