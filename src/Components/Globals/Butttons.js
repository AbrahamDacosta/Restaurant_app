import React from 'react';
import {TouchableOpacity, ActivityIndicator, StyleSheet} from 'react-native';
import {CustomText, LargeText} from './Texts';
import {PRIMARY_COLOR, TEXT_WHITE, BACKGROUND_DARK} from '../../Theme/Theme';

export function AppButton({children, isLoading, ...props}) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      disabled={isLoading || props.disabled}
      style={[
        styles.button,
        {
          backgroundColor: props.backgroundColor || PRIMARY_COLOR,
          opacity: (isLoading || props.disabled) ? 0.6 : 1,
        },
        props.style,
      ]}>
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
    <TouchableOpacity {...props} activeOpacity={0.7}>
      <CustomText
        style={{
          color: PRIMARY_COLOR,
          fontWeight: '600',
        }}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS shadow
    shadowColor: PRIMARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Android elevation
    elevation: 6,
  },
});
