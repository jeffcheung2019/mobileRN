import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import TrailBtn from '@/Assets/Images/buttons/btn_trail.png'
import refreshBtn from '@/Assets/Images/buttons/btn_refresh.png'
type StartButtonProps = {
    containerStyle?: object
    style?: object
    textStyle?: object
    onPress: () => void
    isLoading?: boolean
    text: string
}

const BUTTON_STYLE: ViewStyle = {
    width: "100%",
}
const DEFAULT_TEXT_STYLE = {
    fontSize: 20,
    color: "#fff",
    marginLeft: 10,
    backgroundColor: colors.violetsAreBlue,
}

const StartPauseButton = ({
    containerStyle,
    style,
    textStyle,
    onPress,
    isLoading,
    text
}: StartButtonProps) => {
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
                        {/* <Image source={TrailBtn} style={{ height: 60, resizeMode: "contain"}}> */}
                         <Text
                            style={[DEFAULT_TEXT_STYLE, textStyle, { textAlign: "center" }]}
                        >{text}</Text>
                    {/* </Image> */}
                    </View>
                }
            </Pressable>
        </View>
    )
}

StartPauseButton.defaultProps = {

}

export default StartPauseButton
