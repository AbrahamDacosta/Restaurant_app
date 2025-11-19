import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SimpleCommandeResume from './SimpleCommandeResume';
import { CustomText } from '../../../Components/Globals/Texts';
import { formatDate } from '../../../Utils/Helpers/Parking/ParkingHelper';
import { PRIMARY_COLOR } from '../../../Theme/Theme';
import Feather from 'react-native-vector-icons/Feather';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';
import { useQuery } from 'react-query';
import Daos from '../../../Daos';


export default function SimpleCommandeDetailsScreen() {

    const route = useRoute();
    const { commande } = route.params;
    const navigator = useNavigation();

    // Fetch fresh data with refetch capability
    const { data: commandeDetails, refetch } = useQuery({
        queryKey: ['simpleCommandeDetails', commande?.reference],
        queryFn: () => Daos.Commandes.getOrderDetails(commande?.reference),
        initialData: commande,
        enabled: !!commande?.reference,
        cacheTime: 0
    });

    return (
        <View style={{flex: 1}}>
            <View style={{ backgroundColor: PRIMARY_COLOR, flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigator.goBack() }}>
                    <Feather name="chevron-left" color="white" size={32} />
                </TouchableOpacity>
                <View>
                    <View style={{ padding: 8, borderWidth: 2, borderColor: 'white', borderRadius: 50 }}>
                        <Feather name="box" color="white" size={20} />
                    </View>
                </View>

                {
                    commandeDetails && <View style={{ marginLeft: 8 }}>
                        <CustomText fontFamily="bold" style={{ color: 'white' }}>#{commandeDetails.reference}</CustomText>
                        <CustomText style={{ color: 'white', fontSize: FontSizes.small }}>{formatDate(commandeDetails.date_enreg, "DD MMM YYYY")}</CustomText>
                    </View>}
            </View>
            <View style={{ flex: 1 }}>
                <SimpleCommandeResume reloadCommandeDetailPage={() => {
                    refetch();
                }} commande={commandeDetails} />
            </View>
        </View>
    )
}