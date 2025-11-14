import React, { useImperativeHandle } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomText } from '../Globals/Texts';
import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '../../Theme/Theme';
import Feather from 'react-native-vector-icons/Feather';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import Calendar from "react-native-calendar-range-picker";
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import { useQuery } from 'react-query';
import Daos from '../../Daos';
import useUser from '../../Hooks/useUser';
import { numberFormat } from '../../Utils/Helpers/Parking/ParkingHelper';
import { commandeScreenDateFilterZustore } from '../../Screens/Authenticated/CommandeTab/CommandeTabScreen';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)


function OrderSummary(props, ref) {

    const isLoading = false;
    const user = useUser();


    const [showDatePickerRange, setShowDatePickerRange] = React.useState(false);
    
    const dateFilters = commandeScreenDateFilterZustore();

    console.log("OrderSummary.", dateFilters);


    const fetchSummaryResult = useQuery({
        queryFn: () => {
            const dateStart = dateFilters?.startDate != undefined ? moment(dateFilters.startDate).format('YYYY-MM-DD') : undefined;
            const dateEnd = dateFilters?.startDate != undefined ? moment(dateFilters.endDate).format('YYYY-MM-DD') : undefined;
            return Daos.User.getOrderResume({ dateStart, dateEnd, storeId: user.id });
        },
        queryKey: ['getStoreResume', dateFilters.startDate, dateFilters.endDate]
    });



    const onCancelRange = () => {
        setShowDatePickerRange(false)
    }


    const handling = useImperativeHandle(
        ref, () => {
            return {
                reload(){
                    console.log("orderSummary Reload");
                    fetchSummaryResult.refetch();
                }
            }
        }
    );

    if (fetchSummaryResult.isFetching)
        return <ShimmerPlaceholder height={88} style={{ width: '100%' }} />

    return (
        <View style={{ backgroundColor: PRIMARY_COLOR, padding: 16, }}>
            <View>
                {/* <View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <CustomText fontFamily="bold" style={{ color: 'white', textDecorationLine: 'underline' }}>Date de début</CustomText>
                            <CustomText fontFamily="bold" style={{ fontSize: 16, }}>{dateFilter?.start != undefined ? moment(dateFilter.start).format('DD/MM/YYYY') : "-"}</CustomText>
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomText fontFamily="bold" style={{ color: 'white', textDecorationLine: 'underline' }}>Date de fin</CustomText>
                            <CustomText fontFamily="bold" style={{ fontSize: 16, }}>{dateFilter?.end != undefined ? moment(dateFilter.end).format('DD/MM/YYYY') : "-"}</CustomText>
                        </View>

                    </View>
                </View> */}
                {
                    fetchSummaryResult.data != undefined && (
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <CustomText fontFamily="bold" style={{ color: 'white', textDecorationLine: 'underline' }}>COMMANDES</CustomText>
                                <CustomText fontFamily="bold" style={{ fontSize: 14, }}>{numberFormat(fetchSummaryResult.data.commandes)} FCFA</CustomText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText fontFamily="bold" style={{ color: 'white', textDecorationLine: 'underline' }}>COMMISSIONS</CustomText>
                                <CustomText fontFamily="bold" style={{ fontSize: 14, }}>{numberFormat(fetchSummaryResult.data.commission)} FCFA</CustomText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText fontFamily="bold" style={{ color: 'white', textDecorationLine: 'underline' }}>REVENU</CustomText>
                                <CustomText fontFamily="bold" style={{ fontSize: 14, }}>{numberFormat(fetchSummaryResult.data.revenu)} FCFA</CustomText>
                            </View>
                        </View>
                    )
                }
            </View>


        </View>
    )
}


export default React.forwardRef(OrderSummary);