import React, { StatusBar, Text, View, StyleSheet } from 'react-native';
import HomeScreenHeader from '../../../Components/Headers/HomeScreenHeader';
import { PRIMARY_COLOR } from '../../../Theme/Theme';
import MapView from 'react-native-maps';
import { CustomText } from '../../../Components/Globals/Texts';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import TodayCourseCount from '../../../Components/CurrentUser/TodayCourseCount';
import MoyenneEvaluation from '../../../Components/CurrentUser/MoyenneEvaluation';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)


export default function HomeScreen(props) {

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={PRIMARY_COLOR} />
            <HomeScreenHeader />
            <View style={{ backgroundColor: 'white', paddingVertical: 24, alignItems: 'center' }}>
                <CustomText fontFamily="bold" style={{ fontSize: 16, marginBottom: 16 }}>Aujourd'hui</CustomText>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                    <View>
                        <ShimmerPlaceholder visible={true}>
                            <TodayCourseCount />
                        </ShimmerPlaceholder>
                    </View>

                    <View style={{width: 16}} />

                    <View>
                        <ShimmerPlaceholder visible={true}>
                            <MoyenneEvaluation />
                        </ShimmerPlaceholder>
                    </View>

                </View>

            </View>
            <View style={{ flex: 1 }}>

                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />

            </View>
        </View>);
}


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});