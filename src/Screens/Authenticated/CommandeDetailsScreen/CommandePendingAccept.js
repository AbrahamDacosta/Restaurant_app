import React from 'react';
import { ActivityIndicator, Alert, Modal, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import CommandeContentList from '../../../Components/Commandes/CommandeContentList';
import { ORANGE_COLOR, PRIMARY_COLOR } from '../../../Theme/Theme';
import ConfirmationModal from '../../../Components/Modals/ConfirmartionModal';
import { useMutation, useQuery } from 'react-query';
import Daos from '../../../Daos';
import CheckBox from '@react-native-community/checkbox';
import { AppButton } from '../../../Components/Globals/Butttons';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import SoundNotificationPlayer from '../../../Utils/Helpers/SoundNotificationPlayer';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';

export default function CommandePendingAccept({ reloadCommandeDetailPage, commande }) {
    // console.log("commande =====", commande);

    const navigator = useNavigation();


    const [isConfirmationOpened, setIsConfirmationOpened] = React.useState();
    const [isCancelReasonOpened, setIsCancelReasonOpened] = React.useState(false);

    const [selectedCancelReason, setSelectedCancelReason] = React.useState();

    const { data: cancelReasons, isLoading: isLoadingCancelReasons } = useQuery({
        queryKey: "getCancelReasons",
        queryFn: () => Daos.Commandes.getCancelReason(),
        onError(error) {
            console.log(error)
        }
    })

    const modalConfirmationText = React.useMemo(
        () => {
            if (isConfirmationOpened == "confirm-acceptation") return "Êtes vous sûr de vouloir accepter cette commande ?";

            return "Êtes vous sûr de vouloir dcéliner cette commande ?"
        }, [isConfirmationOpened]
    );

    const { mutate: acceptCommande, isLoading: isAccepting, } = useMutation({
        mutationFn: (commandeId) => Daos.Commandes.acceptCommande(commandeId), onSuccess() {
            console.log("on success");
            SoundNotificationPlayer.stopAlarmSong(true);

            reloadCommandeDetailPage()
        }, onError(error) {
            console.log("Some error happened");
            if (error?.response?.data?.error != undefined) {
                alert(error?.response?.data?.error)
            }
        }
    });
    const { mutate: declineCommande, isLoading: isDeclining } = useMutation({
        mutationFn: ({ reference, reason }) => Daos.Commandes.declineCommande(reference, reason), onSuccess() {
            console.log("on success");
            setTimeout(
                () => {
                    SoundNotificationPlayer.stopAlarmSong(true);
                }, 1000
            )

            reloadCommandeDetailPage()
            setIsCancelReasonOpened(false)
            setSelectedCancelReason();
        }, onError(error) {
            console.log("Some error happened");
            if (error?.response?.data?.error != undefined)
                alert(error?.response?.data?.error)

        }
    });



    return (
        <View style={{ flex: 1 }}>

            <ScrollView refreshControl={
                <RefreshControl isRefreshing={false} onRefresh={() => {
                    reloadCommandeDetailPage();
                }} />
            } style={{ flex: 1, }}>
                <CommandeContentList commandeDetails={commande} hasBeenUpdated={commande.old_order_amount != null && parseInt(commande.old_order_amount) != 0} items={commande.items} oldItems={commande.old_items} />

            </ScrollView>

            {
                (commande.old_order_amount != undefined && parseInt(commande.old_order_amount) != 0) && (
                    <View style={{ backgroundColor: '#ffcdcd', padding: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="alert-triangle" color="#ff5b5b" size={24} />
                        <CustomText style={{ marginHorizontal: 8, flex: 1, color: "red" }}>Le client a reçu la notification et peut accepter ou refuser votre proposition</CustomText>
                    </View>
                )
            }
            <View style={{ backgroundColor: 'white', padding: 12, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                <CustomText fontFamily="bold" style={{ color: 'gray' }}>Montant total</CustomText>
                <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR }}>{commande.order_amount} FR</CustomText>
            </View>

            {
                commande.old == undefined && (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            navigator.navigate(
                                'UpdateCommandeScreen', { commande }
                            );
                        }} style={{ alignItems: 'center', backgroundColor: 'red', flex: 1, alignItems: 'center', paddingVertical: 8 }}>
                            <CustomText fontFamily="bold" style={{ color: 'white', fontSize: FontSizes.regular }}>ACCEPTER PARTIELLEMENT</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setIsCancelReasonOpened(true) }} style={{ alignItems: 'center', backgroundColor: ORANGE_COLOR, flex: 1, alignItems: 'center', paddingVertical: 8 }}>
                            <CustomText fontFamily="bold" style={{ color: 'white', fontSize: FontSizes.large }}>Décliner</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setIsConfirmationOpened("confirm-acceptation") }} style={{ alignItems: 'center', backgroundColor: PRIMARY_COLOR, flex: 1, alignItems: 'center', paddingVertical: 8 }}>
                            <CustomText fontFamily="bold" style={{ color: 'white', fontSize: FontSizes.large }}>Accepter</CustomText>
                        </TouchableOpacity>
                        {
                            (isAccepting || isDeclining) && (
                                <View style={{ position: 'absolute', backgroundColor: isAccepting ? PRIMARY_COLOR : ORANGE_COLOR, top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator size={36} color={"white"} />
                                </View>
                            )
                        }
                    </View>
                )
            }
            <ConfirmationModal onConfirm={() => {
                if (isConfirmationOpened == "confirm-acceptation") {
                    console.log("We will confirm acceptation");
                    acceptCommande(commande.reference);
                }

                setIsConfirmationOpened();
            }} onDismiss={() => { setIsConfirmationOpened() }} confirmationText={modalConfirmationText} isOpen={isConfirmationOpened != undefined} />

            <Modal
                backdropColor={"black"}
                backdropOpacity={0.5}
                animationType="fade"
                statusBarTranslucent={true}
                visible={isCancelReasonOpened}
                onBackdropPress={() => {
                    // onDismiss();
                }}
                onRequestClose={() => {
                    // onDismiss()
                }}>
                <View style={{ backgroundColor: 'white', borderRadius: 4, padding: 16, paddingHorizontal: 24, marginHorizontal: 16, marginTop: 24, flex: 1 }}>
                    <CustomText fontFamily="bold" style={{ fontSize: FontSizes.large }}>Pourquoi souhaitez-vous réfuser la commande ?</CustomText>

                    {
                        isLoadingCancelReasons && <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <ActivityIndicator size={"large"} color={PRIMARY_COLOR} />
                        </View>
                    }

                    {
                        !isLoadingCancelReasons && cancelReasons && (
                            <View style={{ flex: 1 }}>
                                <CustomText style={{ marginBottom: 16 }}>Selectionnez une des raisons lister ci-dessous pour indiquer la raison du refus de la commande</CustomText>

                                {
                                    cancelReasons.map(
                                        item => (
                                            <TouchableOpacity onPress={() => {
                                                if (item.libelle_fr != selectedCancelReason?.libelle_fr)
                                                    setSelectedCancelReason(item);
                                                else
                                                    setSelectedCancelReason();

                                            }} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                                                <CheckBox size={100} value={item.libelle_fr == selectedCancelReason?.libelle_fr} />
                                                <CustomText fontWeight='bold'>{item.libelle_fr}</CustomText>
                                            </TouchableOpacity>
                                        )
                                    )
                                }


                            </View>
                        )
                    }

                    <View style={{ marginTop: 16, justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity disabled={isDeclining} onPress={() => {
                            setIsCancelReasonOpened(false)
                            setSelectedCancelReason();
                        }} style={{ paddingVertical: 8, marginVertical: 4 }}>
                            <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR }}>Annuler</CustomText>
                        </TouchableOpacity>

                        <AppButton
                            isLoading={isDeclining}
                            disabled={selectedCancelReason == undefined}
                            onPress={() => {
                                declineCommande({ reference: commande.reference, reason: selectedCancelReason?.libelle_fr })
                            }} style={{ padding: 8, marginLeft: 16, opacity: selectedCancelReason == undefined ? 0.2 : 1 }}>
                            Confirmer
                        </AppButton>

                    </View>
                </View>
            </Modal>

        </View>
    )
}