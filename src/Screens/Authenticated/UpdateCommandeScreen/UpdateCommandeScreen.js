import React from 'react';
import { FlatList, Image, StatusBar, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { ORANGE_COLOR, PRIMARY_COLOR } from '../../../Theme/Theme';
import { formatDate, generateRandomString, getImageUrl } from '../../../Utils/Helpers/Parking/ParkingHelper';
import { AppButton } from '../../../Components/Globals/Butttons';
import { useMutation } from 'react-query';
import Daos from '../../../Daos';
import SoundNotificationPlayer from '../../../Utils/Helpers/SoundNotificationPlayer';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';

export default function UpdateCommandeScreen() {

    const navigator = useNavigation();
    const { commande } = useRoute().params;

    const [cart, setCart] = React.useState(commande.items.map(
        item => ({ id: item.id, quantity: parseInt(item.quantite), available: true })
    ));

    const { mutate: updateAvailableCommandes, isLoading, error } = useMutation({
        mutationKey: "notifyUserCommandeMissing",
        mutationFn: ({ reference, cart }) => Daos.Commandes.updateAvailableCommandes(reference, cart.filter(item => item.available == true && item.quantity > 0)),
        onSuccess() {
            alert("L'utilisateur a été informé de votre modification.");
            SoundNotificationPlayer.stopAlarmSong(true);
            navigator.navigate('Commande.Details', { commandeId: commande.reference, reloadKey: generateRandomString() });
        }
    });

    
    console.log("cart", cart, error?.message)


    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={'red'} barStyle={'light-content'} />
            <View style={{ backgroundColor: 'red' }}>

                <View style={{ backgroundColor: 'red', flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigator.goBack() }}>
                        <Feather name="chevron-left" color="white" size={32} />
                    </TouchableOpacity>
                    <View>
                        <View style={{ padding: 8, borderWidth: 2, borderColor: 'white', borderRadius: 50 }}>
                            <Feather name="box" color="white" size={20} />
                        </View>
                    </View>

                    {
                        commande && <View style={{ marginLeft: 8 }}>
                            <CustomText fontFamily="bold" style={{ color: 'white' }}>#{commande.reference}</CustomText>
                            <CustomText style={{ color: 'white', fontSize: FontSizes.small }}>{formatDate(commande.date_enreg, "DD MMM YYYY")}</CustomText>
                        </View>}
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={commande.items}
                        renderItem={
                            ({ item }) =>
                                <CommandeItem
                                    canIncreaseQuantity={cart.filter(cartItem => cartItem.id == item.id)[0]?.quantity < parseInt(item.quantite)}
                                    onCommandeQuantityUpdate={(newQuantity) => {
                                        setCart(
                                            (cart.map(
                                                cartItem => {
                                                    if (cartItem.id == item.id)
                                                        return { ...cartItem, quantity: newQuantity }

                                                    return cartItem;
                                                }
                                            ))
                                        );
                                    }}
                                    onCommandeToggle={() => {
                                        setCart(
                                            (cart.map(
                                                cartItem => {
                                                    if (cartItem.id == item.id)
                                                        return { ...cartItem, available: !cartItem.available }

                                                    return cartItem;
                                                }
                                            ))
                                        );
                                    }}

                                    quantity={cart.filter(cartItem => cartItem.id == item.id)[0]?.quantity}
                                    available={cart.filter(cartItem => cartItem.id == item.id)[0]?.available}
                                    commandeItem={item} />
                        }
                    />
                </View>
                <AppButton isLoading={isLoading} onPress={() => {
                    if (cart.filter(item => item.available == true && item.quantity > 0).length > 0)
                        updateAvailableCommandes({
                            reference: commande.reference,
                            cart
                        })
                    else alert("Vous ne pouvez pas proposer une commande sans aucun produit à l'intérieur")
                }} style={{ borderRadius: 0, backgroundColor: ORANGE_COLOR, }} textStyle={{ color: 'white' }}>
                    Notifier le client
                </AppButton>
            </View>
        </View>
    );
}



function CommandeItem({ commandeItem, quantity, canIncreaseQuantity, available, onCommandeQuantityUpdate, onCommandeToggle }) {

    return (
        <View style={{ borderRadius: 12, elevation: 4, backgroundColor: 'white', flexDirection: 'row', marginVertical: 6, marginHorizontal: 12, padding: 14, paddingVertical: 18, alignItems: 'center', opacity: (quantity == 0 || available == false) ? 0.4 : 1 }}>

            <View style={{ backgroundColor: 'white', elevation: 8, borderRadius: 8 }}>
                <Image style={{ height: 72, width: 72, resizeMode: 'contain' }} source={{ uri: getImageUrl(commandeItem.image) }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium }}>{commandeItem.libelle_fr}</CustomText>
                <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, color: ORANGE_COLOR }}>{commandeItem.prix} FCFA</CustomText>

                {
                    commandeItem.item_options != undefined && commandeItem.item_options.length > 0 && (
                        <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR, textDecorationLine: 'underline' }}>Options</CustomText>
                    )
                }
                {
                    commandeItem.item_options.filter(
                        item => !!item.libelle && !!item.prix
                    ).map(
                        item => (
                            <CustomText style={{ color: 'gray', fontSize: FontSizes.small, marginVertical: 2 }}>{item.libelle} ( {item.prix} FCFA )</CustomText>
                        )
                    )
                }


            </View>

            <View style={{ alignItems: 'center', marginLeft: 16 }}>
                <View style={{ alignItems: 'center', backgroundColor: '#dadada', borderRadius: 32 }}>

                    <TouchableOpacity onPress={() => {
                        if (quantity > 0)
                            onCommandeQuantityUpdate(quantity - 1)
                    }} style={{ padding: 12 }}>
                        <FontAwesome color="#ff966f" name="minus" size={24} />
                    </TouchableOpacity>

                    <CustomText fontFamily="bold" style={{ fontSize: moderateScale(24), color: PRIMARY_COLOR }}>{quantity}</CustomText>

                    <TouchableOpacity
                        disabled={!canIncreaseQuantity}
                        onPress={() => {
                            if (canIncreaseQuantity)
                                onCommandeQuantityUpdate(quantity + 1)
                        }} style={{ padding: 12, opacity: canIncreaseQuantity ? 1 : 0 }}>
                        <FontAwesome name="plus" color="#22af76" size={24} />
                    </TouchableOpacity>


                </View>

                <TouchableOpacity onPress={() => { onCommandeToggle() }} style={{ marginTop: 8, padding: 8 }}>
                    {
                        available && (
                            <FontAwesome name="close" color="red" size={24} />
                        )
                    }
                    {
                        !available && (
                            <FontAwesome name="check" color="green" size={24} />
                        )
                    }
                </TouchableOpacity>
            </View>



        </View>
    )
}