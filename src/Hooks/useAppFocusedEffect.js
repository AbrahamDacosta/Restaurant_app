import React from 'react';
import { AppState } from 'react-native';


export default function useAppFocusedEffect(onAppFocused) {

    const appState = React.useRef(AppState.currentState);

    React.useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
                onAppFocused();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);


}