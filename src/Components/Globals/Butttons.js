import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {CustomText, LargeText} from './Texts';
import {PRIMARY_COLOR, TEXT_WHITE, BACKGROUND_DARK} from '../../Theme/Theme';

export function AppButton({children, isLoading, ...props}) {
  return (
    <TouchableOpacity
      {...props}
      style={{
        backgroundColor: props.backgroundColor || PRIMARY_COLOR,
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
      }}>
      {isLoading ? (
        <ActivityIndicator size={26} color={TEXT_WHITE} />
      ) : (
        <LargeText
          fontFamily="bold"
          style={{
            color: props.textColor || TEXT_WHITE,
            ...(props.textStyle ?? {})
          }}>
          {children}
        </LargeText>
      )}
    </TouchableOpacity>
  );
}

export function GrayButton({children, ...props}) {
  return (
    <AppButton {...props} backgroundColor={BACKGROUND_DARK} textColor={TEXT_WHITE}>
      {children}
    </AppButton>
  );
}

export function TextButton({children, ...props}) {
  return (
    <TouchableOpacity {...props}>
      <CustomText
        style={{
          color: PRIMARY_COLOR,
        }}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
}
