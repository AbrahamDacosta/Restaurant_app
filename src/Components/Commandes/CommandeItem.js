import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import { ORANGE_COLOR, PRIMARY_COLOR, CARD_BACKGROUND, TEXT_GRAY, TEXT_WHITE } from '../../Theme/Theme';
import { CustomText } from '../Globals/Texts';
import { formatDate } from '../../Utils/Helpers/Parking/ParkingHelper';
import { FontSizes, Spacing } from '../../Utils/Helpers/ResponsiveHelper';

export default function CommandeItem({ commande, style, onPress, ...otherProps }) {

    let nextStep = {
        "1": "En attente d'affectation à un livreur",
        "2": "Recherche en cours d'un coursier",
        "3": "En attente du coursier pour récuperer la commande",
        "4": "En attente de la livraison de la commande",
    }[commande.etat]

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]} activeOpacity={0.7}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Feather name="box" size={24} color={TEXT_WHITE} />
                </View>
                <View style={styles.infoContainer}>
                    <CustomText fontFamily="bold" style={styles.reference}>
                        #{commande.reference}
                    </CustomText>

                    {
                       commande.etat == "0" && commande.old_order_amount != undefined && parseInt(commande.old_order_amount) != 0 && (
                            <View style={styles.pendingBadge}>
                                <CustomText fontFamily="bold" style={styles.pendingText}>
                                    En attente de l'acceptation du client
                                </CustomText>
                            </View>
                        )
                    }
                    {
                        nextStep && (
                            <CustomText fontFamily="bold" style={styles.statusText}>
                                {nextStep}
                            </CustomText>
                        )
                    }
                    <CustomText style={styles.dateText}>
                        {formatDate(commande.date_enreg, "DD MMM HH:mm")}
                    </CustomText>
                </View>
                <Feather name="chevron-right" size={24} color={TEXT_WHITE} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        // Add shadow and elevation for modern look
        shadowColor: PRIMARY_COLOR,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 12,
    },
    content: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: CARD_BACKGROUND,
        borderWidth: 1,
        borderColor: 'rgba(255, 127, 0, 0.1)',
    },
    iconContainer: {
        padding: 12,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 127, 0, 0.1)',
    },
    infoContainer: {
        flex: 1,
        paddingLeft: 16,
    },
    reference: {
        color: TEXT_WHITE,
        fontSize: FontSizes.large,
        marginBottom: 4,
    },
    pendingBadge: {
        backgroundColor: '#ffcdcd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginVertical: 4,
    },
    pendingText: {
        fontSize: FontSizes.tiny,
        color: '#c41e3a',
    },
    statusText: {
        color: ORANGE_COLOR,
        fontSize: FontSizes.regular,
        marginBottom: 4,
    },
    dateText: {
        color: TEXT_GRAY,
        fontSize: FontSizes.small,
    },
});

