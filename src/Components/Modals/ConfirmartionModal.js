import React from 'react';
import { CustomText } from '../Globals/Texts';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { ORANGE_COLOR, PRIMARY_COLOR } from '../../Theme/Theme';
import Modal from "react-native-modal";


export default function ConfirmationModal({ isOpen, confirmationText, onConfirm, onDismiss, ...props }) {
    


    return (
        <Modal
            backdropColor={"black"}
            backdropOpacity={0.5}
            animationType="fade"
            statusBarTranslucent={true}
            visible={isOpen}
            onBackdropPress={() => {
                onDismiss();
            }}
            onRequestClose={() => {
                onDismiss()
            }}>
            <View style={{ backgroundColor: 'white', borderRadius: 4, padding: 16, paddingHorizontal: 24, marginHorizontal: 16 }}>
                <CustomText fontFamily="bold" style={{ fontSize: 18 }}>Confirmation</CustomText>
                <View style={{ paddingVertical: 8, }}>
                    <CustomText>{confirmationText}</CustomText>
                </View>
                <View style={{ marginTop: 16, alignItems: 'flex-end', }}>
                    <TouchableOpacity onPress={() => onDismiss()} style={{paddingVertical: 8, marginVertical: 4}}>
                        <CustomText fontFamily="bold" style={{ color: ORANGE_COLOR }}>Non, pas du tout</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>onConfirm()} style={{paddingVertical: 8, marginVertical: 4}}>
                        <CustomText fontFamily="bold" style={{ color: PRIMARY_COLOR }}>Oui, je suis sûr</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}