import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {CustomText, LargeText} from './Texts';
import {PRIMARY_COLOR} from '../../Theme/Theme';

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
        <ActivityIndicator size={26} color={'black'} />
      ) : (
        <LargeText
          fontFamily="bold"
          style={{
            color: props.textColor || '#303030',
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
    <AppButton {...props} backgroundColor="#f1ecec" textColor="#303030">
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
