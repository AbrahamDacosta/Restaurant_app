import React from 'react';
import {Text, StyleSheet} from 'react-native';
import { LIGHT_DARK } from '../../Theme/Theme';

const Style = StyleSheet.create({
  normal: {fontFamily: 'Montserrat-Light'},
  thin: {fontFamily: 'Montserrat-Thin'},
  semi: {fontFamily: 'Montserrat-Medium'},
  bold: {fontFamily: 'Montserrat-Bold'},
  light: {fontFamily: 'Montserrat-Light'},
});

export function CustomText({children, ...props}) {
  let currentFont = undefined;

  switch (props.fontFamily) {
    case 'thin':
      currentFont = Style.thin;
      break;
    case 'light':
      currentFont = Style.light;
      break;
    case 'normal':
      currentFont = Style.normal;
      break;
    case 'bold':
      currentFont = Style.bold;
      break;

    default:
      currentFont = Style.normal;
  }

  return (
    <Text {...props} style={{...currentFont, color: LIGHT_DARK, ...props.style}}>
      {children}
    </Text>
  );
}

export function TitleText({children, ...props}) {
  return (
    <CustomText {...props} style={{fontSize: 29, fontWeight: '100', ...props.style}}>
      {children}
    </CustomText>
  );
}

export function LargeText({children, ...props}) {
  return (
    <CustomText {...props} style={{fontSize: 20, ...props.style}}>
      {children}
    </CustomText>
  );
}

export function LightText({children, ...props}) {
  return (
    <CustomText
      {...props}
      style={{
        color: '#b4b3b3',
        ...props.style,
      }}>
      {children}
    </CustomText>
  );
}
