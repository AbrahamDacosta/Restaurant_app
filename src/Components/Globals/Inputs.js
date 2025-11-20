import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'rn-material-ui-textfield';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'
import { TEXT_WHITE, TEXT_GRAY, PRIMARY_COLOR } from '../../Theme/Theme';

export function AppInput(props) {
  return <TextField {...props} />;
}

export function AuthInput(props) {
  return (
    <AppInput
      {...props}
      textColor={TEXT_WHITE}
      baseColor={TEXT_GRAY}
      tintColor={PRIMARY_COLOR}
      labelTextStyle={{ color: TEXT_GRAY }}
      style={{
        ...props.style,
        marginTop: 32,
      }}
    />
  );
}

export function DateInput({onDateChange, value, ...props}) {
  const [pickerShowed, setPickerShowed] = React.useState();

  return (
    <>
      {pickerShowed && (
        <DateTimePickerModal
          isVisible={true}
          mode="date"
          onCancel={() => {
            setPickerShowed(false);
          }}
          onConfirm={date => {
            setPickerShowed(false);
            onDateChange(moment(date).format('YYYY-MM-DD'));

          }}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          setPickerShowed(true);
        }}>
        <AppInput {...props}  value={value} disabled={true}  />
      </TouchableOpacity>
    </>
  );
}

export function TimeInput({onTimeChange, value, containerStyle, ...props}) {
  const [pickerShowed, setPickerShowed] = React.useState();
  return (
    <>
      {pickerShowed && (
        <DateTimePickerModal
          isVisible={true}
          mode="time"
          onCancel={() => {
            setPickerShowed(false);
          }}
          onConfirm={date => {
            onTimeChange(moment(date).format('HH:mm'));
            setPickerShowed(false);
          }}
        />
      )}
      <TouchableOpacity
        style={{...containerStyle}}
        onPress={() => {
          setPickerShowed(true);
        }}>
        <AppInput {...props} value={value} disabled={true} />
      </TouchableOpacity>
    </>
  );
}

