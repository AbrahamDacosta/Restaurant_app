import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../Globals/Texts';
import ToggleSwitch from 'toggle-switch-react-native';
import { useMutation, useQuery } from 'react-query';
import useUser from '../../Hooks/useUser';
import Daos from '../../Daos';

import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { useSelector } from 'react-redux';
import { PRIMARY_COLOR, CARD_BACKGROUND, TEXT_WHITE } from '../../Theme/Theme';

export default function ToggleDisponibility() {

    const token = useSelector(state => state.ApplicationStore.token);
    const user = useUser();

    console.log("ToggleDisponibility - token:", token, "user:", user);

    const { data: currentUser, isFetching, error: fetchCurrentUserError, refetch } = useQuery({
        queryKey: ['getUser'],
        queryFn: () => {
            if (!token || !token.token) {
                console.log("ToggleDisponibility - No token available");
                throw new Error("No token available");
            }
            console.log("ToggleDisponibility - Fetching user info with token:", token.token);
            return Daos.Auth.getUserInfo(token.token);
        },
        retry: 3,
        retryDelay: 1000,
        enabled: !!token && !!token.token,
        onError: (error) => {
            console.log("ToggleDisponibility - Error fetching user:", error);
        },
        onSuccess: (data) => {
            console.log("ToggleDisponibility - User fetched successfully:", data);
        }
    })

    const { data: mutationResult, mutate: toggle, isLoading } = useMutation({
        mutationKey: 'toggleDisponibility', mutationFn: () => Daos.User.toggleOrderAcceptance(user.id), onSuccess(data) {
            console.log("Toggling result", data);
            refetch();
        },
        onError(error) {
            if (error?.response?.data?.error != undefined){
                if(error?.response?.data.error == "Token incorrect")
                    alert("Votre session a expiré");
            }
        }
    });

    // Use Redux user data as fallback if API call fails
    const displayUser = currentUser || user;

    if (isFetching && !user)
        return <ShimmerPlaceHolder LinearGradient={LinearGradient} height={45} width={128} style={{ marginTop: 8 }} />

    console.log("ToggleDisponibility - current user:", currentUser, "token:", token, "error:", fetchCurrentUserError)

    // Only show error if we don't have any user data at all (neither from API nor Redux)
    if (!displayUser) {
        console.log("ToggleDisponibility - Rendering error state");
        return (
            <View style={{ backgroundColor: CARD_BACKGROUND, paddingVertical: 16, borderTopEndRadius: 16, borderTopStartRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <CustomText fontFamily="bold" style={{ color: TEXT_WHITE }}>Erreur de chargement</CustomText>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: CARD_BACKGROUND, paddingVertical: 16, borderTopEndRadius: 16, borderTopStartRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            <CustomText fontFamily="bold" style={{ color: TEXT_WHITE }}>Accepte les commandes</CustomText>

            {
                !isLoading && displayUser != undefined && (
                    <ToggleSwitch
                        disabled={isLoading}
                        isOn={displayUser.accept_order == 1}
                        onColor="green"
                        offColor="red"

                        labelStyle={{ color: "white", fontWeight: "900" }}
                        size="small"
                        onToggle={isOn => toggle()}
                    />
                )
            }

            {
                isLoading && <ActivityIndicator color={PRIMARY_COLOR} />
            }

        </View>
    )
}