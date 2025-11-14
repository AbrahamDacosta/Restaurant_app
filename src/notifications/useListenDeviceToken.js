import React from 'react';
import useUser from '../Hooks/useUser';
import { useMutation } from 'react-query';
import messaging from '@react-native-firebase/messaging';
import Daos from '../Daos';


export default function useListenDeviceToken() {

    const user = useUser();
    const mutation = useMutation({ mutationFn: ({token, userId}) => {
        console.log("in mutation", token, userId);
        return Daos.Auth.updateFirebaseToken(token, userId);
    } });

    console.log("user", user);

    React.useEffect(
        () => {

            if (mutation.error !=undefined) {
                console.log("Retry planified in 5s...");

                setTimeout(
                    () => {
                        console.log("Retry...");
                    }, 5000
                )
            }

        }, [mutation.error]
    );

    React.useEffect(() => {
        console.log("user in listen");

        messaging()
            .getToken()
            .then(token => {
                console.log("device token", {token, userId: user.id});
                if (user.id != null) {
                    mutation.mutate({token, userId: user.id})
                }
            });

        return messaging().onTokenRefresh(token => {
            if (user != null) {
                mutation.mutate({token, userId: user.id})
            }
        });
    }, [user]);

}