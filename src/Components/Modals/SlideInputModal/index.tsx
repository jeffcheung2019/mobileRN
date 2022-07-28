import React, { FC, forwardRef } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '@/Theme/Variables'
import backBtn from '@/Assets/Images/buttons/back.png'
import { useTheme } from '@/Hooks'
import { colors, elevationStyle } from '@/Utils/constants'
import ModalBox from 'react-native-modalbox'

type SlideInputModalProps = {
  onModalClose: () => void
  children: React.ReactNode
  style?: object
  swipeToClose?: boolean
  hasTopBar?: boolean
}

const SlideInputModal = forwardRef((props: SlideInputModalProps, ref) => {
  const { onModalClose, children, style, swipeToClose, hasTopBar = true } = props

  const { Common, Fonts, Gutters, Layout } = useTheme()

  return (
    <ModalBox
      ref={ref as any}
      backdropPressToClose={false}
      swipeToClose={swipeToClose ?? true}
      position='bottom'
      entry='bottom'
      backdrop={false}
      backButtonClose={false}
      isOpen={true}
      onClosed={onModalClose}
      keyboardTopOffset={40}
      animationDuration={500}
      style={{
        height: '60%',
        backgroundColor: '#efefef',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        ...elevationStyle,
        ...style,
      }}
    >
      {hasTopBar && (
        <View style={[Layout.fullWidth, Gutters.regularVPadding, Layout.center]}>
          <View style={{ backgroundColor: colors.darkBlueGray, borderRadius: 20, width: '10%', height: 4 }} />
        </View>
      )}
      {children}
    </ModalBox>
  )
})

export default SlideInputModal
