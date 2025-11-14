import React, { Text, View } from 'react-native';
import { PRIMARY_COLOR } from '../../Theme/Theme';
import ToggleSwitch from 'toggle-switch-react-native'
import ToggleDisponibility from '../CurrentUser/ToggleDisponibility';



export default function HomeScreenHeader(props) {



    return (
        <View style={{ backgroundColor: PRIMARY_COLOR, alignItems: 'center' , padding: 16}}>
            <ToggleDisponibility />
        </View>
    )
}