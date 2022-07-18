import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import copyBtn from '@/Assets/Images/buttons/btn_copy.png'
import refreshBtn from '@/Assets/Images/buttons/btn_refresh.png'

type CircleButtonProps = {
    containerStyle?: object
    style?: object
    textStyle?: object
    onPress: () => void
    isLoading?: boolean
}

const BUTTON_STYLE: ViewStyle = {
    width: "100%",
}

const CircleButton = ({
    containerStyle,
    style,
    textStyle,
    onPress,
    isLoading,
}: CircleButtonProps) => {
    const { Layout, Images } = useTheme()

    return (
        <View style={{
            ...containerStyle,
            width: "100%",
        }}>
            <Pressable
                onPress={onPress}
                style={[BUTTON_STYLE, {
                }]}
            >
                {
                    isLoading ? <ActivityIndicator
                        size="small" color={"#fff"}
                    /> : <View style={[Layout.rowCenter]}>
                        <Image source={copyBtn} style={{height: 60, resizeMode: "contain"}}/>
                    </View>
                }
            </Pressable>
        </View>
    )
}

CircleButton.defaultProps = {

}

export default CircleButton
