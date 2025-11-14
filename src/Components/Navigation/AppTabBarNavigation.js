import React from 'react';
import { CustomText } from '../Globals/Texts';
import { View } from 'react-native'
import Ripple from 'react-native-material-ripple';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LUXURY_BLACK, PRIMARY_COLOR } from '../../Theme/Theme';
import { useSelector } from 'react-redux';

export default function AppTabBarNavigation({ state, descriptors, navigation }) {

    console.log("tabbarprops")

    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                console.log(options);

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <Ripple
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems: 'center', paddingVertical: 15 }}
                    >


                        <View style={{ backgroundColor: isFocused ? PRIMARY_COLOR : 'transparent', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 16 }}>
                            <options.tabBarIcon style={{ fontSize: 24, color: isFocused ? 'white' : 'black' }} name="magnify" />
{/* 
                            {
                                options.tabBarId == "panier" && cartItems.length > 0 && (
                                    <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                        <View style={{ width: 24, height: 24, fontSize: 18,  borderRadius: 50, backgroundColor: LUXURY_BLACK, alignItems: 'center', justifyContent: 'center' }}>
                                            <CustomText fontFamily="bold" style={{  color: 'white', fontSize: 18 }}>{cartItems.length}</CustomText>
                                        </View>
                                    </View>
                                )
                            } */}
                        </View>
                        <CustomText fontFamily="bold" style={{ color: isFocused ? PRIMARY_COLOR : '#222' }}>
                            {label}
                        </CustomText>
                    </Ripple>
                );
            })}

        </View>
    )
}