import React, { createContext } from 'react';
import { RefreshControl, StatusBar, Text, View, useWindowDimensions, FlatList, TouchableOpacity } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import Daos from '../../../Daos';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import CommandeItem from '../../../Components/Commandes/CommandeItem';
import useUser from '../../../Hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '../../../Theme/Theme';
import ToggleDisponibility from '../../../Components/CurrentUser/ToggleDisponibility';
import { firebase } from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';
import SoundNotificationPlayer from '../../../Utils/Helpers/SoundNotificationPlayer';
import useAppFocusedEffect from '../../../Hooks/useAppFocusedEffect';
import OrderSummary from '../../../Components/Commandes/OrderSummary';
import { generateRandomString } from '../../../Utils/Helpers/Parking/ParkingHelper';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import { AppButton } from '../../../Components/Globals/Butttons';
import { FontSizes, moderateScale } from '../../../Utils/Helpers/ResponsiveHelper';


const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const TablistDateFilter = createContext(null)



export default function CommandeTabScreen() {
    const layout = useWindowDimensions();
    const store = useUser();

    const [showDatePickerRange, setShowDatePickerRange] = React.useState(false);


    const tabsDatas = useCommandeStoreForTabScreen();
    const navigation = useNavigation();
    const commandesFilterStore = commandeScreenDateFilterZustore();

    console.log("commandeFilters", commandesFilterStore,);

    navigation.setOptions(
        {
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {
                        (commandesFilterStore.startDate != undefined || commandesFilterStore.endDate != undefined) && (
                            <TouchableOpacity onPress={() => {
                                commandesFilterStore.setDateFilters(
                                    moment().toISOString(), moment().toISOString()
                                )
                            }}>
                                <CustomText fontFamily="bold">
                                    Du {!!commandesFilterStore.startDate ? moment(commandesFilterStore.startDate).format('DD/MM') : "-"} au {!!commandesFilterStore.endDate ? moment(commandesFilterStore.endDate).format('DD/MM') : "-"}
                                </CustomText>
                            </TouchableOpacity>
                        )
                    }

                    <TouchableOpacity onPress={() => {
                        // setShowDatePickerRange(true)
                        // setPickerMode('date-start')
                        // setEndDate(dateFilter?.end)
                        // setStartDate(dateFilter?.start)
                        setShowDatePickerRange(true)
                    }} style={{ alignItems: 'center', marginRight: 12, marginLeft: 4 }} >
                        <Feather color="white" name="calendar" size={28} />
                    </TouchableOpacity>
                </View>
            )
        }
    );

    const [index, setIndex] = React.useState(0);
    // const [routes] = React.useState([
    //     { key: 'nouveau', title: 'First ' + (tabsDatas.nouveau?.isLoading) },
    //     { key: 'enTraitement', title: 'Second' },
    //     { key: 'termines', title: 'Second' },
    // ]);

    const routes = React.useMemo(
        () => {
            return [
                { key: 'nouveau', title: 'Nouveau ' + (tabsDatas.nouveau?.paginationState?.total != undefined ? `(${tabsDatas.nouveau?.paginationState?.total})` : "") },
                { key: 'enTraitement', title: 'En traitements' + (tabsDatas.enTraitement?.paginationState?.total != undefined ? `(${tabsDatas.enTraitement?.paginationState?.total})` : "") },
                { key: 'termines', title: 'Terminées' + (tabsDatas.envoyes?.paginationState?.total != undefined ? `(${tabsDatas.envoyes?.paginationState?.total})` : "") },
            ]
        }, [tabsDatas, commandesFilterStore.startDate, commandesFilterStore.endDate]
    );


    React.useEffect(
        () => {
            return firebase.messaging().onMessage(
                (message) => {
                    console.log("newMessage===>", message);
                    tabsDatas.loadCommandes("nouveau", 1, store.id)
                    tabsDatas.loadCommandes("enTraitement", 1, store.id)
                    tabsDatas.loadCommandes("envoyes", 1, store.id, commandesFilterStore.startDate, commandesFilterStore.endDate)

                    Snackbar.show({
                        text: "Actualisation de la liste des commandes...",
                        duration: Snackbar.LENGTH_LONG
                    });

                }
            )
        }, []
    );

    useAppFocusedEffect(() => {
        tabsDatas.loadCommandes("nouveau", 1, store.id)
        tabsDatas.loadCommandes("enTraitement", 1, store.id)
        tabsDatas.loadCommandes("envoyes", 1, store.id, commandesFilterStore.startDate, commandesFilterStore.endDate)
    });

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={PRIMARY_COLOR_DARK} />
            <TabView
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: 'white' }}
                        style={{ backgroundColor: PRIMARY_COLOR }}
                        renderLabel={({ route, focused, color }) => (
                            <CustomText fontFamily="bold" style={{ color, fontSize: FontSizes.small }}>
                                {route.title}
                            </CustomText>
                        )}
                    />
                )}

                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
            <ToggleDisponibility />


            <CommandeDateRangePicker isVisible={showDatePickerRange} onClose={() => { setShowDatePickerRange(false) }} />



        </View>
    )
}



const useCommandeStoreForTabScreen = create(
    immer(
        (set) => ({
            nouveau: {
                loadingError: undefined,
                isLoading: false,
                items: undefined,
                paginationState: undefined
            },
            enTraitement: {
                loadingError: undefined,
                isLoading: false,
                items: undefined,
                paginationState: undefined
            },
            envoyes: {
                loadingError: undefined,
                isLoading: false,
                items: undefined,
                paginationState: undefined
            },
            loadCommandes: async (type, page, id_store, startDate, endDate) => {
                set(state => { state[type].isLoading = true; state[type].loadingError = undefined; });
                try {
                    console.log(`loadCommandes - type: ${type}, page: ${page}, id_store: ${id_store}`);
                    console.log("=======>" + moment(startDate).format('YYYY-MM-DD') + "<=======")

                    if (startDate != undefined)
                        startDate = moment(startDate).format('YYYY-MM-DD');

                    if (endDate != undefined)
                        endDate = moment(endDate).format('YYYY-MM-DD');

                    console.log(`loadCommandes - Fetching with states: ${getCommandeStatesByType(type)}, startDate: ${startDate}, endDate: ${endDate}`);

                    const getResult = await Daos.Commandes.getCommandeByType({ states: getCommandeStatesByType(type), page, id_store, startDate, endDate },);

                    console.log(`loadCommandes - Result for ${type}:`, getResult);

                    if (page == 1) {
                        set((state) => {
                            state[type].paginationState = getResult;
                            state[type].items = getResult.datas || [];
                        });
                    }
                    else {

                        set((state) => {
                            state[type].paginationState = getResult;
                            if (state[type].items != null && Array.isArray(getResult.datas)) {
                                // Spread the array items instead of pushing the entire array
                                state[type].items = [...state[type].items, ...getResult.datas];
                            }
                            else
                                state[type].items = getResult.datas || [];
                        });
                    }

                    console.log(`loadCommandes - Success for ${type}, items count: ${getResult.datas?.length || 0}`);

                } catch (e) {
                    console.log(`loadCommandes - Fetch error for ${type}:`, e);
                    console.log(`loadCommandes - Error details:`, e.message, e.response?.data, e.response?.status);
                    set(state => { state[type].loadingError = e });
                } finally {
                    // console.log("Fetch finished");
                    set(state => { state[type].isLoading = false });
                }
            }

        })
    )
);



function CommandesScreen({ type }) {

    const {
        loadingError,
        isLoading,
        items,
        paginationState
    } = useCommandeStoreForTabScreen(state => state[type]);

    const filters = commandeScreenDateFilterZustore();

    const navigation = useNavigation();

    const summaryRef = React.useRef(null);

    const store = useUser();

    const { loadCommandes } = useCommandeStoreForTabScreen(state => state);
    // console.log('loadCommandes', loadCommandes);

    React.useEffect(
        () => {
            console.log("startDate", filters.startDate);
            console.log("endDate", filters.endDate);
            if (type == "envoyes")
                loadCommandes(type, 1, store.id, filters.startDate, filters.endDate);
            else
                loadCommandes(type, 1, store.id, filters.startDate, filters.endDate);

        }, [filters.startDate, filters.endDate]
    );

    const noCommandeText = React.useMemo(
        () => {
            if (type == "nouveau") return "Aucune nouvelle commande";
            if (type == "enTraitement") return "Aucune commande en traitement";
            return "Vous n'avez pas de commande sur la période filtrée";
        }, [type]
    )


    console.log('loadingError', loadingError);

    return (
        <View style={{ flex: 1 }}>

            {!isLoading && !!loadingError &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
                    <CustomText style={{ alignItems: 'center', textAlign: 'center', marginBottom: 8 }}>Une erreur est survenue lors de l'obtention des éléments</CustomText>
                    {loadingError?.message && (
                        <CustomText style={{ fontSize: 12, textAlign: 'center', marginBottom: 8, color: '#666' }}>
                            {loadingError.message}
                        </CustomText>
                    )}
                    {loadingError?.response?.data?.error && (
                        <CustomText style={{ fontSize: 12, textAlign: 'center', marginBottom: 8, color: '#666' }}>
                            {loadingError.response.data.error}
                        </CustomText>
                    )}
                    <AppButton onPress={() => {
                        console.log(`Retrying to load ${type} commandes`);
                        loadCommandes(type, 1, store.id, filters.startDate, filters.endDate);
                    }} style={{ padding: 4, paddingHorizontal: 8, marginTop: 8, }}>Tappez pour réessayer</AppButton>
                </View>
            }

            {
                type == "envoyes" && (
                    <OrderSummary ref={summaryRef} />
                )
            }

            {
                isLoading && (
                    <View style={{ padding: 16 }}>

                        <ShimmerPlaceholder height={100} style={{ width: '100%' }} />

                    </View>
                )
            }
            {
                items && <FlatList
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => {
                        loadCommandes("nouveau", 1, store.id)
                        loadCommandes("enTraitement", 1, store.id)
                        loadCommandes("envoyes", 1, store.id, filters.startDate, filters.endDate)
                        if (summaryRef.current != null)
                            summaryRef.current.reload();
                    }} />}
                    data={items}
                    renderItem={({ item }) => {
                        return <CommandeItem onPress={() => {
                            // console.log("Should navigate");
                            navigation.navigate(
                                'Commande.Details', {
                                commandeId: item.reference,
                                commande: item
                            }
                            );
                        }} commande={item} style={{ marginVertical: 8, marginHorizontal: 12 }} />
                    }}
                />
            }
            {
                !!items && items.length == 0 && (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <CustomText fontFamily="bold">{noCommandeText}</CustomText>
                    </View>

                )
            }
        </View>
    )
}

const createCommandeScreen = ({ type }) => function () {
    return <CommandesScreen type={type} />
};


const CommandesEnCours = createCommandeScreen({ type: "nouveau" });
const CommandesEnTraitement = createCommandeScreen({ type: "enTraitement" });
const CommandesTermines = createCommandeScreen({ type: "envoyes" });

const renderScene = SceneMap({
    nouveau: CommandesEnCours,
    enTraitement: CommandesEnTraitement,
    termines: CommandesTermines,
});


function getCommandeStatesByType(type) {
    switch (type) {
        case "nouveau": return "0";
        case "enTraitement": return "1,2,3,4"
        case "envoyes": return "5"
    }
}

export const commandeScreenDateFilterZustore = create(
    (set) => ({
        startDate: moment().toISOString(),
        endDate: moment().toISOString(),
        setDateFilters(startDate, endDate) {
            set((state) => ({
                startDate,
                endDate,
            }));
        },
    })
)


function CommandeDateRangePicker({ isVisible, onClose }) {

    const [pickerMode, setPickerMode] = React.useState('date-start');
    const dateRangeFilter = commandeScreenDateFilterZustore();

    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');



    const activeDate = React.useMemo(
        () => {
            if (pickerMode == "date-start" && !!startDate) return moment(startDate).toDate();
            if (pickerMode == "date-end" && !!endDate) return moment(endDate).toDate();
            return new Date();
        }, [pickerMode, startDate, endDate]
    );

    React.useEffect(
        () => {
            if (isVisible) {
                setPickerMode("date-start");
            }
        }, [isVisible]
    );

    React.useEffect(
        () => {
            if (pickerMode == "date-start" && !startDate)
                setStartDate(moment().toDate());
            if (pickerMode == "date-end" && !endDate)
                setEndDate(moment().toDate());
        }, [pickerMode]
    );


    return <Modal
        backdropColor='black'
        style={{}}
        onBackdropPress={() => { onClose() }}
        onBackButtonPress={() => { onClose() }}
        visible={isVisible} hasBackdrop={true}>
        <View style={{ backgroundColor: PRIMARY_COLOR_DARK }} >

            <View style={{ padding: 16 }}>
                <CustomText fontFamily="bold" style={{ fontSize: FontSizes.large }}>
                    {
                        pickerMode == "date-start" ? "Selectionnez la date de départ" : "Selectionnez la date de fin"
                    }
                </CustomText>
            </View>

            <View style={{ paddingHorizontal: 16, flexDirection: 'row', }}>
                <TouchableOpacity onPress={() => {
                    setPickerMode('date-start')
                }} style={{ flex: 1 }}>
                    <CustomText fontFamily="bold" style={{ color: 'white' }}>Du</CustomText>
                    <CustomText fontFamily={pickerMode == "date-start" ? "bold" : undefined} style={{ fontSize: moderateScale(24), }}>
                        {
                            !!startDate ? moment(startDate).format("DD/MM/YYYY") : "-"
                        }
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setPickerMode('date-end')
                }} style={{ flex: 1 }}>
                    <CustomText fontFamily="bold" style={{ color: 'white' }}>Au</CustomText>
                    <CustomText fontFamily={pickerMode == "date-end" ? "bold" : undefined} style={{ fontSize: moderateScale(24), }}>
                        {
                            !!endDate ? moment(endDate).format("DD/MM/YYYY") : "-"
                        }
                    </CustomText>
                </TouchableOpacity>
            </View>

            {/* <View>
            <CustomText>test</CustomText>
        </View> */}

            <DatePicker mode="date" date={activeDate} onDateChange={(date) => {
                console.log("On date change", date);
                if (pickerMode == "date-start")
                    setStartDate(date);
                else
                    setEndDate(date);
            }} />
            <View style={{ padding: 16, alignItems: 'flex-end' }}>

                <View style={{ height: 16 }} />
                {
                    pickerMode == "date-start" && (
                        <TouchableOpacity onPress={() => {
                            if (startDate != undefined)
                                setPickerMode("date-end")
                            else alert("Vous devez selectionner la date de début")
                        }}>
                            <CustomText fontFamily="bold" style={{ padding: 0, color: 'white' }}>Selectionnez la date de fin</CustomText>
                        </TouchableOpacity>
                    )
                }

                {
                    pickerMode == "date-end" && (
                        <TouchableOpacity onPress={() => {
                            if (endDate != undefined) {
                                dateRangeFilter.setDateFilters(
                                    startDate,
                                    endDate
                                );
                                onClose();
                            }

                            else alert("Vous devez selectionner la date de début")
                        }}>
                            <CustomText fontFamily="bold" style={{ padding: 0, color: 'white' }}>Filter</CustomText>
                        </TouchableOpacity>
                    )
                }</View>
        </View>
    </Modal >
}