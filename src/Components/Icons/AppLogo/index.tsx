import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, StyleProp, ViewStyle, ImageStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import whiteAppLogo from '@/Assets/Images/logos/whitelogo.png'
import logo from '@/Assets/Images/logos/logo.png'

type AppLogoProps = {
  imageStyle?: object
  type: string
}

const AppLogo = ({ imageStyle, type }: AppLogoProps) => {
  const { Layout, Images } = useTheme()

  let appLogoSource = type === 'color' ? logo : whiteAppLogo

  return (
    <Image
      source={appLogoSource}
      style={{
        height: '100%',
        resizeMode: 'contain',
        ...imageStyle,
      }}
    />
  )
}

AppLogo.defaultProps = {}

export default AppLogo
