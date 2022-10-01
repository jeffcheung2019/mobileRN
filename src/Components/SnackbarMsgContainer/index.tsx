import React, { FC } from 'react'
import { View, Image, Text, StyleProp, ActivityIndicator, ViewStyle, TextProps, ViewProps } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors, config } from '@/Utils/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface SnackbarMsgContainerProps extends ViewProps {
  textMessage: string
}

const SnackbarMsgContainer = ({ textMessage }: SnackbarMsgContainerProps) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 99,
        elevation: 4,
        paddingLeft: 30,
        paddingRight: 10,
      }}
    >
      <View style={{ flex: 6, justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, color: '#fff' }}>{textMessage}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name='check-circle' size={config.iconSize} />
      </View>
    </View>
  )
}

SnackbarMsgContainer.defaultProps = {}

export default SnackbarMsgContainer
