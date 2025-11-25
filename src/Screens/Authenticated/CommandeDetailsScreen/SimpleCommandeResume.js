import React from 'react';
import { ActivityIndicator, Alert, Modal, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import CommandeContentList from '../../../Components/Commandes/CommandeContentList';
import ContactsSection from '../../../Components/Commandes/ContactsSection';
import { ORANGE_COLOR, PRIMARY_COLOR, CARD_BACKGROUND, TEXT_WHITE, TEXT_GRAY } from '../../../Theme/Theme';
import ConfirmationModal from '../../../Components/Modals/ConfirmartionModal';
import { useMutation, useQuery } from 'react-query';
import Daos from '../../../Daos';
import CheckBox from '@react-native-community/checkbox';
import { AppButton } from '../../../Components/Globals/Butttons';

export default function SimpleCommandeResume({ reloadCommandeDetailPage, commande }) {
    // console.log("commande =====", commande);

    return (
        <View style={{ flex: 1 }}>

            <ScrollView refreshControl={
                <RefreshControl isRefreshing={false} onRefresh={() => {
                    reloadCommandeDetailPage();
                }} />
            } style={{ flex: 1, }}>
                <CommandeContentList commandeDetails={commande} items={commande.items} />

                {/* Contacts Section */}
                <ContactsSection commande={commande} />

            </ScrollView>
            <View style={{ backgroundColor: CARD_BACKGROUND, padding: 12, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
                <CustomText fontFamily="bold" style={{ color: TEXT_GRAY }}>Montant total</CustomText>
                <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR }}>{commande.order_amount} FR</CustomText>
            </View>
        </View>
    )
}