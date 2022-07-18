import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, StyleProp, ViewStyle, ImageStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import appIcon from '@/Assets/Images/logos/logo.png'

type AppIconProps = {
  style?: object
  imageStyle?: object
}

const AppIcon = ({ style, imageStyle }: AppIconProps) => {
  const { Layout, Images } = useTheme()

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        ...style,
      }}
    >
      <Image
        source={appIcon}
        style={{
          height: '100%',
          resizeMode: 'contain',
          ...imageStyle,
        }}
      />
    </View>
  )
}

AppIcon.defaultProps = {}

export default AppIcon
