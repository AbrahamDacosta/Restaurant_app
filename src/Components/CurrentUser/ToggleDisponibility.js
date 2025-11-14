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
import { PRIMARY_COLOR } from '../../Theme/Theme';

export default function ToggleDisponibility() {

    const token = useSelector(state => state.ApplicationStore.token);
    const user = useUser();

    const { data: currentUser, isFetching, fetchCurrentUserError, refetch } = useQuery({ queryKey: ['getUser'], queryFn: () => Daos.Auth.getUserInfo(token.token), })

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

    if (isFetching)
        return <ShimmerPlaceHolder LinearGradient={LinearGradient} height={45} width={128} style={{ marginTop: 8 }} />

    console.log("current user", currentUser, token, fetchCurrentUserError)

    return (
        <TouchableOpacity onPress={() => {
            toggle();
        }} style={{ backgroundColor: '#e8e8e8', paddingVertical: 16, borderTopEndRadius: 16, borderTopStartRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            <CustomText fontFamily="bold" style={{ color: PRIMARY_COLOR }}>Accepte les commandes</CustomText>

            {
                !isLoading && currentUser != undefined && (
                    <ToggleSwitch
                        disabled={isLoading}
                        isOn={currentUseesr.accept_order == 1}
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

        </TouchableOpacity>
    )
}