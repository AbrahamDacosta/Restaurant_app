import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import CommandeContentList from '../../../Components/Commandes/CommandeContentList';
import { CustomText } from '../../../Components/Globals/Texts';
import { ORANGE_COLOR } from '../../../Theme/Theme';
import ConfirmationModal from '../../../Components/Modals/ConfirmartionModal';
import { useMutation } from 'react-query';
import Daos from '../../../Daos';


export default function CommandePendingAffectationLivreur({commande, reloadCommandeDetailPage}) {

    const [isConfirmationOpened, setIsConfirmationOpened] = React.useState();

    const { mutate: affectToRider, isLoading: isAffecting, } = useMutation({
        mutationFn: (commandeId) => Daos.Commandes.affectLivreur(commandeId), onSuccess(response) {
            console.log("on success", response);
            reloadCommandeDetailPage()
        }, onError() {
            console.log("Some error happened");
        }
    });

    return (
        <View style={{ flex: 1 }}>


            <ScrollView  refreshControl={
                <RefreshControl isRefreshing={false} onRefresh={() => {
                    reloadCommandeDetailPage();
                }} />
            } style={{ flex: 1 }} contentContainerStyle={{flex: 1}}>
                <View style={{flex: 1}}>

                <CommandeContentList commandeDetails={commande} items={commande.items} />
                <View style={{ backgroundColor: 'white', padding: 12, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CustomText fontFamily="bold" style={{ color: 'gray' }}>Montant total</CustomText>
                    <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR }}>25.000 FR</CustomText>
                </View>
                </View>
            </ScrollView>


            <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { setIsConfirmationOpened("affect-to-rider") }} style={{ backgroundColor: ORANGE_COLOR, flex: 1, alignItems: 'center', paddingVertical: 8 }}>
                    <CustomText fontFamily="bold" style={{ color: 'white', fontSize: 24 }}>Affecter à un livreur</CustomText>
                </TouchableOpacity>
                {
                    (isAffecting) && (
                        <View style={{ position: 'absolute', backgroundColor: ORANGE_COLOR, top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={36} color={"white"} />
                        </View>
                    )
                }
            </View>

            <ConfirmationModal onConfirm={() => {
                if (isConfirmationOpened == "affect-to-rider") {
                    console.log("We will confirm acceptation", commande, commande.reference);
                    affectToRider(commande.reference);
                }
                setIsConfirmationOpened();
            }} onDismiss={() => { setIsConfirmationOpened() }} confirmationText={"Êtes vous sûr de vouloir Affecter la commande à un livreur ?"} isOpen={isConfirmationOpened != undefined} />
        </View>
    );
}