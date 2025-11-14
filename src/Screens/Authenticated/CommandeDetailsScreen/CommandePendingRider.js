import React, { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import { PRIMARY_COLOR } from '../../../Theme/Theme';
import { AppButton } from '../../../Components/Globals/Butttons';
import { useNavigation } from '@react-navigation/native';

export default function CommandePendingRider({reloadCommandeDetailPage, commande}){

    const navigation = useNavigation();


    return (
        <View style={{flex: 1}}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => {
                    console.log("On refresh")
                    reloadCommandeDetailPage();
                }} />
            }  contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={PRIMARY_COLOR} />
            <CustomText fontFamily="bold" style={{color: PRIMARY_COLOR}}>Recherche d'un livreur en cours</CustomText>
            <CustomText>Veuillez patienter svp...</CustomText>

            <AppButton style={{paddingVertical: 4, marginTop: 24}} onPress={() => {
                navigation.navigate("SimpleCommandeDetailsScreen", {commande: commande})
            }}>Voir la commande</AppButton>
        </ScrollView>
        </View>
    )
}