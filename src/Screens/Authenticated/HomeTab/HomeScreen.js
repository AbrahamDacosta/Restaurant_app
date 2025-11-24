import React, { StatusBar, Text, View, StyleSheet } from 'react-native';
import HomeScreenHeader from '../../../Components/Headers/HomeScreenHeader';
import { PRIMARY_COLOR, BACKGROUND_DARK, CARD_BACKGROUND, TEXT_WHITE } from '../../../Theme/Theme';
import MapView from 'react-native-maps';
import { CustomText } from '../../../Components/Globals/Texts';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import TodayCourseCount from '../../../Components/CurrentUser/TodayCourseCount';
import MoyenneEvaluation from '../../../Components/CurrentUser/MoyenneEvaluation';
import { FontSizes } from '../../../Utils/Helpers/ResponsiveHelper';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)


export default function HomeScreen(props) {

    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_DARK }}>
            <StatusBar backgroundColor={PRIMARY_COLOR} />
            <HomeScreenHeader />
            <View style={{ backgroundColor: CARD_BACKGROUND, paddingVertical: 24, alignItems: 'center' }}>
                <CustomText fontFamily="bold" style={{ fontSize: FontSizes.medium, marginBottom: 16, color: TEXT_WHITE }}>Aujourd'hui</CustomText>

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