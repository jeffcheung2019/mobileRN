import React, { FC } from 'react'
import { View, Image, Text, StyleProp, ActivityIndicator, ViewStyle, TextProps, ViewProps } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'

interface LoadingScreenProps extends ViewProps {}

const LoadingScreen = (props: LoadingScreenProps) => {
  const { Layout, Images } = useTheme()

  return (
    <View
      {...props}
      style={{
        ...(props.style as object),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        height: '100%',
        opacity: 0.7,
        backgroundColor: colors.black,
      }}
    >
      <ActivityIndicator color={colors.darkBlueGray} size='large' />
    </View>
  )
}

LoadingScreen.defaultProps = {}

export default LoadingScreen
