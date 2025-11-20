import React from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from 'react-query';
import Daos from '../../../Daos';
import Feather from 'react-native-vector-icons/Feather';
import { ORANGE_COLOR, PRIMARY_COLOR, BACKGROUND_DARK, CARD_BACKGROUND, TEXT_WHITE } from '../../../Theme/Theme';
import CommandeDetailsShimmer from './CommandeDetailsShimmer';
import CommandePendingAccept from './CommandePendingAccept';
import CommandePendingAffectationLivreur from './CommandePendingAffectationLivreur';
import CommandePendingLivraison from './CommandePendingLivraison';
import { formatDate, isCommandeStateEncours } from '../../../Utils/Helpers/Parking/ParkingHelper';
import SimpleCommandeResume from './SimpleCommandeResume';
import CommandePendingRider from './CommandePendingRider';
import { firebase } from '@react-native-firebase/messaging';
import useAppFocusedEffect from '../../../Hooks/useAppFocusedEffect';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';

export default function CommandeDetailsScreen() {

    const navigator = useNavigation();
    const route = useRoute();
    const { commandeId, reloadKey } = route.params || {};

    const { isLoading, isRefetching, data: commandeDetails, error, refetch } = useQuery(
        {
            queryKey: ['commandeDetails', commandeId], queryFn: () => Daos.Commandes.getOrderDetails(commandeId),
            onSuccess(data) {
                console.log("On call success ", data);
            },
            cacheTime: 0
        }
    );


    React.useEffect(
        () => {
            return firebase.messaging().onMessage(
                () => {
                    refetch();
                }
            )
        }, []
    );

    React.useEffect(() => {
        refetch();
    }, [reloadKey])


    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [])
    );

    useAppFocusedEffect(() => {
        refetch();
    });


    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_DARK }}>
            <View style={{ backgroundColor: PRIMARY_COLOR, flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigator.goBack() }}>
                    <Feather name="chevron-left" color={TEXT_WHITE} size={32} />
                </TouchableOpacity>
                <View>
                    <View style={{ padding: 8, borderWidth: 2, borderColor: TEXT_WHITE, borderRadius: 50 }}>
                        <Feather name="box" color={TEXT_WHITE} size={20} />
                    </View>
                </View>

                {
                    commandeDetails && <View style={{ marginLeft: 8 }}>
                        <CustomText fontFamily="bold" style={{ color: TEXT_WHITE }}>#{commandeId}</CustomText>
                        <CustomText style={{ color: TEXT_WHITE, fontSize: FontSizes.small }}>{formatDate(commandeDetails.date_enreg, "DD MMM YYYY")}</CustomText>
                    </View>}
            </View>
            <View style={{ flex: 1 }}>
                {
                    (isLoading || isRefetching) && (
                        <CommandeDetailsShimmer />
                    )
                }

                {/* {
                    !isLoading && !isRefetching && commandeDetails.etat == "3" && (
                        <ScrollView refreshControl={<RefreshControl
                            onRefresh={() => {
                                refetch();
                            }}
                        />} contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', }} style={{ flex: 1 }}>
                            <ActivityIndicator color={PRIMARY_COLOR} size={64} />
                            <CustomText fontFamily="bold">Recherche d'un livreur en cours...</CustomText>
                            <CustomText>Veuillez patienter svp...</CustomText>
                        </ScrollView>
                    )
                } */}

                {
                    commandeDetails != undefined && (["0", "1", "4", "5", "6"].includes(commandeDetails.etat)) &&  (

                        <View style={{ marginVertical: 8, paddingHorizontal: 16, marginVertical: 8, backgroundColor: CARD_BACKGROUND, }}>

                            <View onPress={() => {

                            }} style={{  borderRadius: 4, borderColor: ORANGE_COLOR, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', }}>
                                <Image source={require("assets/images/couverts.png")} style={{ tintColor: PRIMARY_COLOR, height: 32, width: 32, resizeMode: 'contain', marginRight: 8 }} />
                                <CustomText fontFamily="bold" style={{ color: TEXT_WHITE, flex: 1, fontSize: FontSizes.large }}>Couvert demandé</CustomText>
                            </View>

                            <CustomText fontFamily="bold" style={{ marginLeft: 42,  fontSize: moderateScale(24), color: commandeDetails.need_ustensile == '1' ? 'green' : 'red' }}>{commandeDetails.need_ustensile == '1' ? "Oui" : "Non"}</CustomText>

                        </View>

                    )

                }

                {/* {
                    commandeDetails != undefined && commandeDetails.paiement_methode != "161" && commandeDetails.cash_amount != undefined && (
                        <View style={{ marginVertical: 8, paddingHorizontal: 16, }}>
                            <View onPress={() => {

                            }} style={{ borderRadius: 4, borderColor: ORANGE_COLOR, borderRadius: 8, flexDirection: 'row', alignItems: 'center', }}>
                                <MaterialCommunityIcons name="cash" color={"#85BB65"} size={42} />
                                <CustomText fontFamily="bold" style={{ color: "#85BB65", flex: 1, fontSize: FontSizes.large }}>Cash Disponible</CustomText>
                            </View>
                            <CustomText fontFamily="bold" style={{ marginLeft: 42, marginTop: -14, fontSize: moderateScale(24), color: ORANGE_COLOR }}>{commandeDetails.cash_amount} FCFA</CustomText>
                        </View>
                    )
                } */}

{/* 
                {
                    commandeDetails != undefined && commandeDetails.paiement_methode != "161" && (
                        <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                            <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, color: PRIMARY_COLOR }}>{commandeDetails.responsable_frais?.toUpperCase()}</CustomText>
                            <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, marginLeft: 8, color: "green" }}>La facture de la commande a déja été payé</CustomText>
                            <Ionicons name="checkmark-done" color="green" size={24} />
                        </View>
                    )
                } */}


                {
                    (!isLoading && !isRefetching) && !!commandeDetails && commandeDetails.etat == "0" && (
                        <CommandePendingAccept reloadCommandeDetailPage={() => {
                            refetch();
                            // console.log("We should reload commande details page");
                        }} commande={commandeDetails} />
                    )
                }

                {
                    (!isLoading && !isRefetching) && commandeDetails && ["1"].includes(commandeDetails.etat) && (
                        <CommandePendingAffectationLivreur commandeDetails={commandeDetails} reloadCommandeDetailPage={() => {
                            refetch();
                            // console.log("We should reload commande details page");
                        }} commande={commandeDetails} />
                    )
                }

                {
                    (!isLoading && !isRefetching) && commandeDetails && commandeDetails.etat == "2" && (
                        <CommandePendingRider reloadCommandeDetailPage={() => {
                            refetch();
                            // console.log("We should reload commande details page");
                        }} commande={commandeDetails} />
                    )
                }

                {
                    (!isLoading && !isRefetching) && !!commandeDetails && ["3", "4"].includes(commandeDetails.etat) && (
                        <CommandePendingLivraison reloadCommandeDetailPage={() => {
                            refetch();
                            // console.log("We should reload commande details page");
                        }} commande={commandeDetails} />
                    )
                }

                {
                    (!isLoading && !isRefetching) && ["6", "5"].includes(commandeDetails.etat) && (
                        <SimpleCommandeResume reloadCommandeDetailPage={() => {
                            refetch();
                        }} commande={commandeDetails} />
                    )
                }

            </View>
        </View>
    )
}