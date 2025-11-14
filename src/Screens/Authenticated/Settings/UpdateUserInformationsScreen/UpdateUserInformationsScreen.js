import { useFormik } from 'formik';
import React from 'react';
import { AuthInput } from '../../../../Components/Globals/Inputs';
import { TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import { ORANGE_COLOR } from '../../../../Theme/Theme';
import { CustomText } from '../../../../Components/Globals/Texts';



const validationSchema = Yup.object().shape({
    old_password: Yup.string().required('Champs requis'),
    password: Yup.string().required('Champs requis'),
    password_confirmation: Yup.string().required('Champs requis'),
});


export default function UpdateUserInformationsScreen() {

    


    const formik = useFormik({
        initialValues: {
            old_password: '',
            password: '',
            password_confirmation: '',
        },
        onSubmit(values) {
            // loginUser(values);
            alert("Un problème est survenue lors du contact avec le serveur");
        },
        onError(e) {
            console.log(e);
        },
        validationSchema,
        validateOnMount: false,
        validateOnChange: false,
        validateOnBlur: false,
    });



    return (<View style={{ flex: 1 }}>

        <View style={{ padding: 16, flex: 1 }}>


            <AuthInput
                label="Ancien mot de passe"
                error={formik?.errors.old_password}
                secureTextEntry={true}
                style={{ padding: 0 }}
                value={formik.values.old_password}
                onChangeText={value => {
                    formik.handleChange('old_password')(value);
                }}
                placeholder="Mot de passe"
            />

            <AuthInput
                label="Nouveau mot de passe"
                error={formik?.errors.password}
                secureTextEntry={true}
                style={{ padding: 0 }}
                value={formik.values.password}
                onChangeText={value => {
                    formik.handleChange('password')(value);
                }}
                placeholder="Mot de passe"
            />


            <AuthInput
                label="Confirmation du nouveau mot de passe"
                error={formik?.errors.password_confirmation}
                secureTextEntry={true}
                style={{ padding: 0 }}
                value={formik.values.password_confirmation}
                onChangeText={value => {
                    formik.handleChange('password_confirmation')(value);
                }}
                placeholder="Mot de passe"
            />
        </View>


        <TouchableOpacity onPress={() => {
            formik.submitForm()
         }} style={{ backgroundColor: ORANGE_COLOR, alignItems: 'center', paddingVertical: 8 }}>
            <CustomText fontFamily="bold" style={{ color: 'white', fontSize: 24 }}>Modifier</CustomText>
        </TouchableOpacity>
    </View>)
} 