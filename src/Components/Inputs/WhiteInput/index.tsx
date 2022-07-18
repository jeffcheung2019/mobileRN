import React, { FC } from 'react'
import { View, Image, Text, TextInput, StyleProp, ViewStyle, ImageStyle, TextInputProps } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import appLogo from '@/Assets/Images/logos/logo.png'

interface WhiteInputProps extends TextInputProps {
    containerStyle?: object,
}

const WhiteInput = (props: WhiteInputProps) => {
    const { Layout, Images } = useTheme()

    const {
        containerStyle,
        style,
        onChangeText,
        value,
        placeholder,
        placeholderTextColor
    } = props

    return (
        <View style={{
            width: "100%",
            alignItems: "center",
            ...containerStyle,
        }}>
            <TextInput
                {...props}
                style={{
                    width: "100%",
                    backgroundColor: colors.platinum,
                    borderRadius: 10,
                    height: 45,
                    textAlign: "center",
                    color: colors.spanishGray,
                    ...style as object,
                }}
            />
        </View>
    )
}

WhiteInput.defaultProps = {

}

export default WhiteInput
