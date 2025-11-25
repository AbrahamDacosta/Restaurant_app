import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../Globals/Texts';
import Feather from 'react-native-vector-icons/Feather';
import { CARD_BACKGROUND, TEXT_WHITE, TEXT_GRAY } from '../../Theme/Theme';
import { FontSizes } from '../../Utils/Helpers/ResponsiveHelper';

export default function ContactsSection({ commande }) {
    // Don't render if no contact information is available
    if (!commande || (!commande.nom_client && !commande.telephone_client && !commande.telephone_service)) {
        return null;
    }

    const makePhoneCall = (phoneNumber) => {
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    return (
        <View style={{ marginHorizontal: 12, marginVertical: 8, backgroundColor: CARD_BACKGROUND, borderRadius: 12, padding: 16 }}>
            <CustomText fontFamily="semi" style={{ fontSize: FontSizes.large, color: '#A0AEC0', marginBottom: 12 }}>
                Contacts
            </CustomText>

            {/* Client Information */}
            {commande.nom_client && (
                <View style={{ marginBottom: 8 }}>
                    <CustomText fontFamily="regular" style={{ fontSize: FontSizes.small, color: TEXT_GRAY }}>
                        CLIENT: {commande.nom_client}
                    </CustomText>
                </View>
            )}

            {/* Client Phone Number */}
            {commande.telephone_client && (
                <TouchableOpacity
                    onPress={() => makePhoneCall(commande.telephone_client)}
                    style={{
                        backgroundColor: '#FF6B6B',
                        borderRadius: 8,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12
                    }}
                >
                    <Feather name="phone" color={TEXT_WHITE} size={20} style={{ marginRight: 8 }} />
                    <CustomText fontFamily="bold" style={{ color: TEXT_WHITE, fontSize: FontSizes.regular }}>
                        {commande.telephone_client}
                    </CustomText>
                </TouchableOpacity>
            )}

            {/* Service Client Section */}
            {commande.telephone_service && (
                <>
                    <CustomText fontFamily="regular" style={{ fontSize: FontSizes.small, color: TEXT_GRAY, marginTop: 8 }}>
                        SERVICE CLIENT
                    </CustomText>

                    {/* Service Client Phone Number */}
                    <TouchableOpacity
                        onPress={() => makePhoneCall(commande.telephone_service)}
                        style={{
                            backgroundColor: '#FF6B6B',
                            borderRadius: 8,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 8
                        }}
                    >
                        <Feather name="phone" color={TEXT_WHITE} size={20} style={{ marginRight: 8 }} />
                        <CustomText fontFamily="bold" style={{ color: TEXT_WHITE, fontSize: FontSizes.regular }}>
                            {commande.telephone_service}
                        </CustomText>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}
