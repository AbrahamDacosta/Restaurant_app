import React from 'react';
import {View, Image, StatusBar} from 'react-native';
import { LargeText, LightText } from '../../Components/Globals/Texts';
import { PRIMARY_COLOR } from '../../Theme/Theme';
import ContainerView from '../../Components/Globals/ContainerView';
import { AppButton } from '../../Components/Globals/Butttons';
import { useDispatch } from 'react-redux';
import { introFinished } from '../../Store/ApplicationStore';

export default function FirstLaunchScreen() {

    const dispatch = useDispatch();

  return (
    <View style={{flex: 1, backgroundColor: 'purple'}}>
      <StatusBar backgroundColor="black" />
      <View
        style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
        <Image
          source={require('assets/images/couloir_garage.png')}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </View>
      <ContainerView style={{backgroundColor: 'transparent', justifyContent: 'space-between', paddingBottom: 27}}>


          <View>
          <LargeText fontFamily="bold" style={{color: 'white'}}>Park<LargeText fontFamily="bold" style={{color: PRIMARY_COLOR}}>Manager</LargeText></LargeText>
        
          <LightText>Votre outil de gestion de parking</LightText>

          </View>


          <AppButton onPress={()=>{
    dispatch(introFinished());

          }}>Commencer maintenant</AppButton>

      </ContainerView>
    </View>
  );
}
