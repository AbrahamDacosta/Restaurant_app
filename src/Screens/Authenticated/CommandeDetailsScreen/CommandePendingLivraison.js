import React from 'react';
import { ActivityIndicator, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../../../Components/Globals/Texts';
import MapView, { Marker } from 'react-native-maps';
import Timeline from 'react-native-timeline-flatlist'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARY_COLOR } from '../../../Theme/Theme';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../../Components/Globals/Butttons';
import { useMutation, useQuery } from 'react-query';
import Daos from '../../../Daos';

export default function CommandePendingLivraison({ commande }) {

    const navigation = useNavigation();
    const googleMapRef = React.useRef();

    const [lastRiderPosition, setLastRiderPosition] = React.useState();
    const [regionChanged, setRegionChanged] = React.useState();

    console.log("=========>commande details", commande)

    const timelineData = React.useMemo(
        () => {
            let listes = commande.historique.map(
                (historyItem) => {
                    return {
                        time: moment(historyItem.date_enreg).format("HH:mm"),
                        title: historyItem.libelle,
                        checked: true
                    }
                }
            );

            let nextStep = {
                "1": "En attente d'affectation à un livreur",
                "2": "En attente de l'acceptation d'un coursier",
                "3": "En attente du coursier pour récuperer la commande",
                "4": "En attente de la livraison de la commande"
            }[commande.etat]

            if (nextStep == undefined)
                return listes;

            return [
                {
                    time: "-",
                    title: nextStep
                },
                ...listes
            ];
        }, [commande]
    );

    // console.log("timeline data", timelineData);

    React.useEffect(
        () => {
            const timer = setInterval(() => {
                console.log("get position livreur");

                Daos.Commandes.getRiderPositionByCommande(commande.reference)
                    .then(
                        (position) => {
                            console.log("position=>", position)

                            if (position != false && !!position.lat && !!position.lng) {

                                setLastRiderPosition({
                                    latitude: parseFloat(position.lat),
                                    longitude: parseFloat(position.lng),
                                });

                                if (!regionChanged && !!googleMapRef.current)
                                    googleMapRef.current.animateCamera(
                                        {
                                            center: {
                                                latitude: parseFloat(position.lat),
                                                longitude: parseFloat(position.lng),
                                            },
                                            zoom: 14,
                                        },
                                        { duration: 2000 }
                                    );
                            }
                        }
                    );

            }, 10000)

            return () => {
                console.log("Clear interval...")
                clearInterval(timer);
            }
        }, [regionChanged]
    );


    return (
        <View style={{ flex: 1 }}>

            {/* <View style={{ flex: 1 }}> */}



                {/* <MapView
                    ref={googleMapRef}
                    style={styles.map}
                    onRegionChangeComplete={(region, { isGesture }) => {
                        console.log("on region changed ", isGesture)
                        if (isGesture == true)
                            setRegionChanged(true);
                    }}
                    initialRegion={{
                        latitude: 5.316667,
                        longitude: -4.033333,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {
                        lastRiderPosition && (
                            <Marker coordinate={lastRiderPosition} />
                        )
                    }
                </MapView> */}

                {/* {
                    lastRiderPosition == undefined &&
                    (
                        <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' }}>
                            <CustomText fontFamily="bold" style={{ color: 'white' }}>Recherche de la position du livreur</CustomText>
                            <ActivityIndicator color={"white"} />
                        </View>
                    )
                } */}

                {/* {
                    regionChanged == true &&
                    <AppButton onPress={
                        () => {
                            if (lastRiderPosition) {
                                googleMapRef.current.animateCamera(
                                    {
                                        center: lastRiderPosition,
                                        zoom: 14,
                                    },
                                    { duration: 2000 }
                                );
                                setRegionChanged()
                            }
                        }
                    } style={{ padding: 4, paddingHorizontal: 16, position: 'absolute', right: 16, top: 16 }} textStyle={{ fontSize: 12 }}>Suivre le livreur</AppButton>

                } */}

            {/* </View> */}


            <View style={{ flex: 1, backgroundColor: 'white', padding: 18 }}>

                {
                    commande.etat == "3" && (
                        <CommandeReadyButton reference={commande.reference} />
                    )
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CustomText fontFamily="bold" style={{ marginBottom: 8 }}>Resumé de la commande</CustomText>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("SimpleCommandeDetailsScreen", {
                                commande
                            });
                        }}
                        style={{
                            backgroundColor: PRIMARY_COLOR, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8
                            , borderRadius: 4
                        }}>
                        <CustomText style={{ color: 'white', }} fontFamily="bold">Voir la commande</CustomText>
                    </TouchableOpacity>
                </View>


                <Timeline
                    renderDetail={(data) => {
                        return (
                            <View style={{ backgroundColor: 'white', borderRadius: 4, elevation: 4, padding: 12, marginRight: 12, flexDirection: 'row' }}>
                                <CustomText fontFamily="bold" style={{ flex: 1 }}>{data.title}</CustomText>
                                {
                                    data.checked && (
                                        <Ionicons name="checkmark-done-outline" color={PRIMARY_COLOR} size={24} />
                                    )
                                }
                            </View>
                        )
                    }}
                    data={timelineData}
                />

            </View>


        </View >
    );
}


function CommandeReadyButton({ reference }) {

    const { isLoading, mutate: notifyRider } = useMutation({
        mutationKey: "orderReadySendNotification",
        mutationFn: () => Daos.Commandes.orderReady(reference),
        onSuccess() {
            alert("La notification a été transmise au livreur responsable de la commande.");
        }
    });

    return (
        <AppButton style={{ padding: 4, marginBottom: 16 }} textStyle={{ fontSize: 12 }} isLoading={isLoading} onPress={() => {
            notifyRider();
        }}>
            Notifier que la commande est prête
        </AppButton>
    )
}


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});