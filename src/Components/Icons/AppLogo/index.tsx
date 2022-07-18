import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, StyleProp, ViewStyle, ImageStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import whiteAppLogo from '@/Assets/Images/logos/whitelogo.png'
import logo from '@/Assets/Images/logos/logo.png'

type AppLogoProps = {
  style?: object
  imageStyle?: object
  type: string
}

const AppLogo = ({ style, imageStyle, type }: AppLogoProps) => {
  const { Layout, Images } = useTheme()

  let appLogoSource = type === 'color' ? logo : whiteAppLogo

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        ...style,
      }}
    >
      <Image
        source={appLogoSource}
        style={{
          height: '100%',
          resizeMode: 'contain',
          ...imageStyle,
        }}
      />
    </View>
  )
}

AppLogo.defaultProps = {}

export default AppLogo
