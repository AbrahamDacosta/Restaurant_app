import React from 'react';
import { CustomText } from '../../../Components/Globals/Texts';
import { FlatList, Image, RefreshControl, View, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useMutation, useQuery } from 'react-query';
import Daos from '../../../Daos';
import useUser from '../../../Hooks/useUser';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

import LinearGradient from 'react-native-linear-gradient';
import { getImageUrl } from '../../../Utils/Helpers/Parking/ParkingHelper';
import { ORANGE_COLOR, PRIMARY_COLOR, BACKGROUND_DARK, CARD_BACKGROUND, TEXT_WHITE, TEXT_GRAY } from '../../../Theme/Theme';
import ToggleSwitch from 'toggle-switch-react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { AppInput } from '../../../Components/Globals/Inputs';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

export default function ProductsScreen() {

    const store = useUser();
    const navigation = useNavigation();

    const [isSearchOpen, setIsSearchOpen] = React.useState();
    const [search, setSearch] = React.useState();

    navigation.setOptions(
        {
            headerRight: () => {
                return <TouchableOpacity onPress={() => {
                    if (!!isSearchOpen) {
                        setSearch();
                    }
                    setIsSearchOpen(!isSearchOpen);
                }} style={{
                    marginRight: 16
                }}>
                    <Feather name="search" size={32} color="white" style={{ color: 'white' }} />
                </TouchableOpacity>
            },

        }
    );


    const fetchStoreProducts = useQuery(
        {
            queryFn: () => Daos.User.getProductList(store.id, search),
            queryKey: ['getProductStore', search],

        }
    );

    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_DARK }}>

            {
                isSearchOpen && (
                    <View style={{ backgroundColor: PRIMARY_COLOR, padding: 8, flexDirection: 'row', alignItems: 'center', paddingRight: 16 }}>
                        <TextInput onChangeText={(value) => {
                            setSearch(value);
                        }} placeholder='Recherchez un produit' placeholderTextColor={"white"} style={{ flex: 1, color: TEXT_WHITE }} />
                        <TouchableOpacity onPress={() => {
                            setSearch()
                            setIsSearchOpen(false)
                        }} style={{ padding: 8 }}>
                            <Fontisto style={{ color: 'white' }} name="close-a" />
                        </TouchableOpacity>
                    </View>
                )
            }


            {fetchStoreProducts.isLoading &&
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                    () => <View style={{ marginBottom: 8 }}>
                        <ShimmerPlaceholder height={72} style={{ width: '100%' }} />
                    </View>
                )
            }

            {
                fetchStoreProducts.data && (
                    <FlatList
                        refreshControl={<RefreshControl
                            refreshing={fetchStoreProducts.isFetching} onRefresh={() => {
                                fetchStoreProducts.refetch();
                            }} />}

                        data={fetchStoreProducts.data.datas}
                        renderItem={({ item }) => <ProductItem key={item.id} product={item} statut={item.statut} />}
                    />
                )
            }

        </View>
    )
}



function ProductItem({ product, statut }) {

    const [localState, setLocalState] = React.useState(statut);

    const toggleProduct = useMutation({
        mutationKey: 'updateProductItem' + product.id,
        mutationFn: () => Daos.User.toggleProduct(product.id),
        onSuccess(result) {
            setLocalState(result.statut)
            console.log("Toggle result", result);
        }
    });

    React.useEffect(
        () => {
            setLocalState(statut);
        }, [statut]
    );


    return (
        <View style={{ borderRadius: 12, elevation: 4, backgroundColor: CARD_BACKGROUND, flexDirection: 'row', marginVertical: 6, marginHorizontal: 12, padding: 14, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 127, 0, 0.1)' }}>

            <View style={{ backgroundColor: CARD_BACKGROUND, elevation: 8, borderRadius: 8 }}>
                <Image style={{ height: 72, width: 72, resizeMode: 'contain' }} source={{ uri: getImageUrl(product.image) }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, color: TEXT_WHITE }}>{product.libelle_fr}</CustomText>
                <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, color: ORANGE_COLOR, textDecorationLine: product.prix_promo != null ? 'line-through' : undefined, }}>{product.prix} FCFA</CustomText>
                {
                    !!product.prix_promo && (
                        <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, color: ORANGE_COLOR }}>PROMO: {product.prix_promo} FCFA</CustomText>
                    )
                }

                {/* {
                    !!commandeItem.informations && (
                        <CustomText fontFamily="bold" style={{ fontSize: 13, color: 'red' }}>Instructions spécifique: {commandeItem.informations}</CustomText>
                    )
                } */}
                <View style={{ flexDirection: 'row' }}>

                    <ToggleSwitch
                        isOn={localState == "1"}
                        onColor="green"
                        offColor="red"

                        labelStyle={{ color: "white", fontWeight: "900" }}
                        size="small"
                        onToggle={isOn => {
                            toggleProduct.mutate()
                        }}
                    />

                    {
                        toggleProduct.isLoading && (
                            <ActivityIndicator />
                        )
                    }

                </View>


            </View>

        </View>
    )
}