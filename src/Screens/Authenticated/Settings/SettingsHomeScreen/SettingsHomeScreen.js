import React from 'react';
import { View, TouchableOpacity, Image, Linking } from 'react-native'
import ContainerView from '../../../../Components/Globals/ContainerView';
import { AppButton } from '../../../../Components/Globals/Butttons';
import { LargeText, CustomText, TitleText } from '../../../../Components/Globals/Texts';
import { DEFAULT_BORDER_COLOR, ORANGE_COLOR, PRIMARY_COLOR } from '../../../../Theme/Theme';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
import { deconnectUser } from '../../../../Store/ApplicationStore';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/messaging';
import Daos from '../../../../Daos';
import useUser from '../../../../Hooks/useUser';
import { getImageUrl } from '../../../../Utils/Helpers/Parking/ParkingHelper';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default function SettingsHomeScreen() {

    const user = useUser();

    const dispatch = useDispatch();
    const token = useSelector((state) => state.ApplicationStore.token);

    const [isDeconnecting, setIsDeconnecting] = React.useState();

    async function logout() {

        try {

            setIsDeconnecting(true);

            await firebase.messaging().unsubscribeFromTopic('stores-online');
            await firebase.messaging().subscribeToTopic('stores-offline');

            await Daos.Auth.updateFirebaseToken(undefined, user.id)

            dispatch(deconnectUser())
        } catch (e) {
            console.log(e);
            alert("Une erreur est survenue, veuillez réessayer");
        } finally {
            setIsDeconnecting(false);
        }

    }

    function callPhone(phoneNumber){
        Linking.openURL(`tel:${phoneNumber}`)
    }


    return (
        <View style={{ flex: 1 }}>
            <ContainerView style={{ paddingBottom: 16 }}>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 72, width: 72 }} source={{
                        uri: getImageUrl(
                            !!user.image ? user.image : 'user-200.png'
                        )
                    }} />

                    <View style={{ marginLeft: 16 }}>
                        <CustomText fontFamily="bold" style={{ fontSize: 24, color: PRIMARY_COLOR }}>{user.store_name}</CustomText>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome size={18} color={PRIMARY_COLOR} name="phone" />
                            <CustomText fontFamily="semi" style={{ fontSize: 16, marginLeft: 8, color: PRIMARY_COLOR }}>{user.phone}</CustomText>
                        </View>

                    </View>


                </View>
                

                <AppButton style={{ marginTop: 20 }} isLoading={isDeconnecting} onPress={() => {
                    logout()
                }}>Deconnexion</AppButton>

                <View style={{ flex: 1 }}>

                </View>


                <View style={{ marginTop: 34, marginBottom: 16 }}>
                <View style={{height: 1, backgroundColor: 'gray', opacity: 0.2, marginBottom: 8}}></View>

                    <CustomText fontFamily="bold" style={{ fontSize: 24, color: 'gray' }}>Contactez-nous</CustomText>
                </View>

                <View>
                    <CustomText fontFamily="bold" style={{fontSize: 16}}>SERVICE CLIENT</CustomText>
                    <TouchableOpacity onPress={() => callPhone("0799079729")} style={{ backgroundColor: ORANGE_COLOR, flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 10  }}>
                        <FontAwesome name="phone" color="white" size={22} />
                        <CustomText style={{color: 'white', fontSize: 22, flex: 1, textAlign: 'right'}} textAlign="right" fontFamily="bold">07 99 07 97 29</CustomText>
                    </TouchableOpacity>
                </View>

                <View>
                    <CustomText fontFamily="bold" style={{fontSize: 16, marginTop: 8}}>SERVICE TECHNIQUE</CustomText>
                    <TouchableOpacity onPress={() => callPhone("0715032308")} style={{ backgroundColor: ORANGE_COLOR, flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 10  }}>
                        <FontAwesome name="phone" color="white" size={22} />
                        <CustomText style={{color: 'white', fontSize: 22, flex: 1, textAlign: 'right'}} textAlign="right" fontFamily="bold">07 15 03 23 08</CustomText>
                    </TouchableOpacity>
                </View>

                <View style={{marginBottom: 8}}>
                    <CustomText fontFamily="bold" style={{fontSize: 16, marginTop: 8}}>SERVICE FINANCIER</CustomText>
                    <TouchableOpacity onPress={() => callPhone("0714075932")} style={{ backgroundColor: ORANGE_COLOR, flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 10  }}>
                        <FontAwesome name="phone" color="white" size={22} />
                        <CustomText style={{color: 'white', fontSize: 22, flex: 1, textAlign: 'right'}} textAlign="right" fontFamily="bold">07 14 07 59 32</CustomText>
                    </TouchableOpacity>
                </View>

                {/* <View style={{ flex: 1 }}> */}
                {/* <TitleText style={{ marginBottom: 18 }}>Paramètres</TitleText> */}
                {/* <LargeText fontFamily="bold">Général</LargeText> */}
                {/* <SettingItem link="UpdateUserInformationsScreen" title="Modifier mon mot de passe" /> */}
                {/* <SettingItem title="Notifications" />
                    <SettingItem title="Nous contacter" /> */}

                {/* <LargeText fontFamily="bold" style={{ marginTop: 16 }}>Plus</LargeText> */}
                {/* <SettingItem title="A propos" /> */}
                {/* <SettingItem link="PolicyScreen" title="Politiques de confidentialités" /> */}
                {/* <SettingItem link="CGUScreen" title="Condition d'utilisation" /> */}
                {/* <SettingItem title="FAQ" /> */}
                {/* <SettingItem title="Supprimer mon compte" /> */}

                {/* </View> */}
            </ContainerView>
        </View>
    )
}


function SettingItem({ title, link }) {

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={
            () => {
                if (link)
                    navigation.navigate(link)
            }
        } style={{ padding: 8, paddingVertical: 10, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: DEFAULT_BORDER_COLOR, alignItems: 'center' }}>
            <CustomText style={{ flex: 1 }}>{title}</CustomText>
            <AntDesign name="right" />
        </TouchableOpacity>
    )
}