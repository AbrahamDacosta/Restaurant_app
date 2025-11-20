import React from 'react';
import { CustomText } from '../Globals/Texts';
import { Image, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ORANGE_COLOR, CARD_BACKGROUND, TEXT_GRAY } from '../../Theme/Theme';
import { getImageUrl } from '../../Utils/Helpers/Parking/ParkingHelper';


export default function CommandeContentList({ items, oldItems, hasBeenUpdated, commandeDetails }) {

    function renderItem({ item }) {

        const oldItem = oldItems?.find(oldItem => item.id == oldItem.id);
        console.log(oldItems);

        console.log("oldItems", oldItems);

        return (
            <View>

                {
                    commandeDetails && !!commandeDetails.infos_supplementaires && (
                        <View style={{  paddingHorizontal: 16, paddingVertical: 8 }}>
                            <CustomText fontFamily="semi" style={{ fontSize: 14, color: TEXT_GRAY }}>Information(s) supplémentaire(s)</CustomText>
                            <CustomText fontFamily="bold" style={{ color: 'red' }}>{commandeDetails.infos_supplementaires}</CustomText>
                        </View>
                    )
                }


                <CommandeItem key={item.id} commandeItem={item} hasBeenUpdated={hasBeenUpdated} oldCommandeItem={oldItem} />

            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {
                items.map(item => renderItem({ item }))
            }
            {/* <FlatList
            
            data={items}
                renderItem={renderItem}
            /> */}
        </View>
    )
}

function CommandeItem({ commandeItem, oldCommandeItem, hasBeenUpdated }) {

    return (
        <View style={{ borderRadius: 12, elevation: 4, backgroundColor: CARD_BACKGROUND, flexDirection: 'row', marginVertical: 6, marginHorizontal: 12, padding: 14, paddingVertical: 18, alignItems: 'center' }}>

            <View style={{ backgroundColor: CARD_BACKGROUND, elevation: 8, borderRadius: 8 }}>
                <Image style={{ height: 72, width: 72, resizeMode: 'contain' }} source={{ uri: getImageUrl(commandeItem.image) }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <CustomText fontFamily="bold" style={{ fontSize: 16 }}>{commandeItem.libelle_fr}</CustomText>
                {
                    !!commandeItem.informations && (
                        <CustomText fontFamily="bold" style={{ fontSize: 13, color: 'red' }}>Instruction(s) spécifique(s): {commandeItem.informations}</CustomText>
                    )
                }
                <CustomText fontFamily="bold" style={{ fontSize: 16, color: ORANGE_COLOR }}>{commandeItem.prix} FCFA</CustomText>

                {
                    commandeItem.item_options != undefined && commandeItem.item_options.filter(
                        item => !!item.libelle && !!item.prix
                    ).length > 0 && (
                        <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR, textDecorationLine: 'underline' }}>Options</CustomText>
                    )
                }
                {
                    commandeItem.item_options.filter(
                        item => !!item.libelle && !!item.prix
                    ).map(
                        item => (
                            <CustomText fontFamily="bold" style={{ color: 'red', fontSize: 14, fontWeight: 'boldest', marginVertical: 2 }}>+ {item.libelle} ( {item.prix} FCFA )</CustomText>
                        )
                    )
                }

                {/* {
                    oldCommandeItem == undefined && !!hasBeenUpdated && (
                        <View style={{ backgroundColor: '#ffcdcd' }}>
                            <View style={{ backgroundColor: '#ffcdcd', color: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                                <CustomText fontFamily="bold" style={{ fontSize: 10 }}>Vous nous pouvez pas fournir ce produit
                                </CustomText>
                            </View>
                        </View>
                    )
                } */}


            </View>

            <View>
                <CustomText fontFamily="bold" style={{ fontSize: 24, color: 'red' }}>X{commandeItem.quantite}</CustomText>
                {
                    oldCommandeItem && (
                        <CustomText style={{ fontSize: 18, textDecorationLine: 'line-through', color: 'red' }}>X{oldCommandeItem.quantite}</CustomText>
                    )
                }

            </View>

        </View>
    )
}