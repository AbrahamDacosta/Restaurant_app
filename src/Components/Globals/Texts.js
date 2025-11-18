import React from 'react';
import {Text, StyleSheet} from 'react-native';
import { LIGHT_DARK } from '../../Theme/Theme';
import { FontSizes } from '../../Utils/Helpers/ResponsiveHelper';

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
    <CustomText {...props} style={{fontSize: FontSizes.title, fontWeight: '100', ...props.style}}>
      {children}
    </CustomText>
  );
}

export function LargeText({children, ...props}) {
  return (
    <CustomText {...props} style={{fontSize: FontSizes.large, ...props.style}}>
      {children}
    </CustomText>
  );
}

export function MediumText({children, ...props}) {
  return (
    <CustomText {...props} style={{fontSize: FontSizes.medium, ...props.style}}>
      {children}
    </CustomText>
  );
}

export function RegularText({children, ...props}) {
  return (
    <CustomText {...props} style={{fontSize: FontSizes.regular, ...props.style}}>
      {children}
    </CustomText>
  );
}

export function SmallText({children, ...props}) {
  return (
    <CustomText {...props} style={{fontSize: FontSizes.small, ...props.style}}>
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
        fontSize: FontSizes.regular,
        ...props.style,
      }}>
      {children}
    </CustomText>
  );
}
