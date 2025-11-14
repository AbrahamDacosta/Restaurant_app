import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import { ORANGE_COLOR, PRIMARY_COLOR } from '../../Theme/Theme';
import { CustomText } from '../Globals/Texts';
import { formatDate } from '../../Utils/Helpers/Parking/ParkingHelper';

export default function CommandeItem({ commande, style, onPress, ...otherProps }) {

    let nextStep = {
        "1": "En attente d'affectation à un livreur",
        "2": "Recherche en cours d'un coursier",
        "3": "En attente du coursier pour récuperer la commande",
        "4": "En attente de la livraison de la commande",
    }[commande.etat]

    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, borderRadius: 12, paddingVertical: 16, alignItems: 'center', backgroundColor: 'white', elevation: 2, }}>
                <View style={{ padding: 12, borderWidth: 2, borderColor: PRIMARY_COLOR, borderRadius: 50 }}>
                    <Feather name="box" size={24} />
                </View>
                <View style={{ flex: 1, paddingLeft: 16 }}>
                    <CustomText fontFamily="bold">#{commande.reference}</CustomText>

                    {
                       commande.etat == "0" && commande.old_order_amount != undefined && parseInt(commande.old_order_amount) != 0 && (
                            <View style={{ backgroundColor: '#ffcdcd', color: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                                <CustomText fontFamily="bold" style={{ fontSize: 10 }}>En attente de l'acceptation du clients</CustomText>
                            </View>
                        )
                    }
                    {
                        nextStep && (
                            <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR }}>{nextStep}</CustomText>
                        )
                    }
                    <CustomText style={{ color: 'gray' }}>{formatDate(commande.date_enreg, "DD MMM HH:mm")}</CustomText>
                </View>
                <Feather name="chevron-right" size={24} />
            </View>
        </TouchableOpacity>
    );
}

