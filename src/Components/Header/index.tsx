import React, { FC, useState } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, Image, TextInput } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '@/Theme/Variables'
import backBtn from '@/Assets/Images/buttons/back.png'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export const headerHeight = 50

// static styles
const ROOT: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
}
const TITLE: TextStyle = { textAlign: 'center', color: colors.darkCharcoal, fontWeight: 'bold', width: '100%' }
const TITLE_MIDDLE: ViewStyle = {
  justifyContent: 'center',
  width: '100%',
  height: headerHeight,
  flex: 3,
  alignItems: 'center',
}
const LEFT: ViewStyle = { flex: 1 }
const RIGHT: ViewStyle = { flex: 1 }

const HEADER: TextStyle = {
  height: headerHeight,
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
const Header = (props: {
  onLeftPress?: () => void
  onRightPress?: () => void
  rightIcon?: () => React.ReactNode
  leftIcon?: () => React.ReactNode
  headerText?: string
  headerTx?: string
  style?: object
  titleStyle?: object
}) => {
  const { onLeftPress, onRightPress, rightIcon, leftIcon, headerText, headerTx, style, titleStyle } = props

  const { Common, Fonts, Gutters, Layout } = useTheme()
  const { t: translate } = useTranslation()
  const header = headerText || (headerTx && translate(headerTx)) || ''
  const [searchText, setSearchText] = useState('')

  const onSearchTextChange = (text: string) => {
    setSearchText(text)
  }

  return (
    <View style={[ROOT, HEADER, style]}>
      {onLeftPress ? (
        <Pressable
          style={{ height: '100%', paddingLeft: 20, flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={onLeftPress}
        >
          {<MaterialIcons name={'chevron-left'} size={24} color={colors.darkCharcoal} />}
        </Pressable>
      ) : (
        <View style={[LEFT]} />
      )}

      {header ? (
        <View style={TITLE_MIDDLE}>
          <Text style={[TITLE, Fonts.textRegular, titleStyle]}>{header}</Text>
        </View>
      ) : null}

      {rightIcon && onRightPress ? (
        <Pressable
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1,
          }}
          onPress={onRightPress}
        >
          {rightIcon()}
        </Pressable>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}

export default Header
