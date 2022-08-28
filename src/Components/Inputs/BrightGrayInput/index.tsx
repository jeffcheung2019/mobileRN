import React, { FC } from 'react'
import { View, Image, Text, TextInput, StyleProp, ViewStyle, ImageStyle, TextInputProps } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import appLogo from '@/Assets/Images/logos/logo.png'
import Animated, { FadeInDown } from 'react-native-reanimated'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

type BrightGrayInputProps = {
  textInputProps?: TextInputProps
  value: string
  onChangeText: (text: string) => void
  icon?: () => React.ReactNode
  disableDefaultAnimation?: boolean
  inputStyle?: ViewStyle
}

const BrightGrayInput = (props: BrightGrayInputProps) => {
  const { Layout, Images } = useTheme()

  const { value, textInputProps, onChangeText, icon, disableDefaultAnimation, inputStyle } = props
  let enteringAnimation = disableDefaultAnimation === true ? undefined : FadeInDown.duration(1000)
  return (
    <Animated.View
      entering={enteringAnimation}
      style={{
        alignItems: 'center',
        flexBasis: 50,
        alignContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.brightGray,
        borderRadius: 10,
        paddingHorizontal: 10,
        ...inputStyle,
      }}
    >
      {icon && icon()}
      <TextInput
        style={[{ paddingLeft: 20, flex: 6, height: 50 }]}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        {...textInputProps}
      />
    </Animated.View>
  )
}

BrightGrayInput.defaultProps = {}

export default BrightGrayInput
