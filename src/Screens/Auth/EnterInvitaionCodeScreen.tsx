import React, { useState, useEffect, useCallback, FC, useRef } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout, storeInvitationCode } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import EncryptedStorage from 'react-native-encrypted-storage'
// @ts-ignore
import Amplify, { Auth, Hub } from 'aws-amplify'
// @ts-ignore
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
import { RootState } from '@/Store'
import { Header } from '@/Components'
import { Spacing } from '@/Theme/Variables'
import LoadButton from '@/Components/Buttons/LoadButton'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'

import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import AppLogo from '@/Components/Icons/AppLogo'
import backBtn from '@/Assets/Images/buttons/back.png'
import WhiteInput from '@/Components/Inputs/WhiteInput'
import AppIcon from '@/Components/Icons/AppIcon'
import { color } from 'react-native-reanimated'
import ActionButton from '@/Components/Buttons/ActionButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import { triggerSnackbar } from '@/Utils/helpers'
import ModalBox from 'react-native-modalbox'

import AsyncStorage from '@react-native-async-storage/async-storage'
import StandardInput from '@/Components/Inputs/StandardInput'
import { storeReferralCode } from '@/Store/Referral/actions'
import crashlytics from '@react-native-firebase/crashlytics'

const LOGIN_BUTTON: ViewStyle = {
  height: 40,
  flexDirection: 'row',
}

const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
}

const BUTTON_ICON = {
  width: 30,
}

const BUTTON_TEXT: TextStyle = {
  width: 100,
  color: '#fff',
}

const INPUT_VIEW_LAYOUT: ViewStyle = {
  justifyContent: 'center',
}

const EnterInvitaionCodeScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.enterInvitationCode>> = ({ navigation, route }) => {
  const modalRef = useRef<any>()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route?.params || { code: '' }

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errMsg, setErrMsg] = useState(' ')
  const [code, setCode] = useState('')

  const { invitationCode } = useSelector((state: RootState) => state.user)

  const referralCode = useSelector((state: RootState) => state.referral.referralCode)

  useEffect(() => {
    if (referralCode !== '') {
      setCode(referralCode)
    }
  }, [referralCode])

  const goBack = () => {
    navigation.goBack()
  }

  const onStartPress = async () => {
    try {
      let userReferralCheckRes = await axios.get(config.userReferralCheck(code))
      dispatch(
        storeInvitationCode({
          invitationCode: code,
        }),
      )
      navigation.navigate(RouteStacks.signUpWithCode)
    } catch (err: any) {
      //crashlytics().recordError(err)
      setErrMsg(t('error.invalidReferralCode'))
    }
  }

  const onCodeChange = (text: string) => {
    setCode(text)
  }

  const onModalClose = () => {
    navigation.navigate(RouteStacks.welcome)
  }

  const onGetReferralCodePress = () => {
    // Linking.openURL('https://discord.gg/fitevo')
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.enterInvitationCode}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter, Layout.justifyContentStart]}>
        <Header headerText={t('referralCode')} onLeftPress={goBack} withProfile={false} />

        <View
          style={[
            {
              height: '40%',
              justifyContent: 'center',
            },
            Layout.fullWidth,
          ]}
        >
          <AppIcon />

          <View style={[Layout.fullWidth, { justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 40 }]}>
            <Text style={[{ color: colors.white, lineHeight: 22 }, Fonts.textSM, Fonts.textCenter]}>{t('enterInvitationCodeDesc')}</Text>
          </View>
        </View>

        <ModalBox
          ref={modalRef}
          backdropPressToClose={false}
          swipeToClose={true}
          position='bottom'
          entry='bottom'
          backdrop={false}
          backButtonClose={false}
          isOpen={true}
          keyboardTopOffset={41}
          animationDuration={500}
          onClosed={onModalClose}
          style={{
            height: '50%',
            backgroundColor: colors.charcoal,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={[
              Layout.fill,
              {
                minHeight: 300,
              },
            ]}
          >
            <View style={[Layout.fullWidth, Gutters.regularVPadding, Layout.center]}>
              <View style={{ backgroundColor: colors.spanishGray, borderRadius: 20, width: '10%', height: 4 }} />
            </View>

            <View style={[Layout.fullWidth, Gutters.largeHPadding, INPUT_VIEW_LAYOUT, { flexBasis: 80 }]}>
              <StandardInput
                onChangeText={onCodeChange}
                value={code}
                placeholder={t('referralCode')}
                placeholderTextColor={colors.spanishGray}
                style={{
                  borderBottomWidth: 1,
                  borderColor: colors.silverSand,
                }}
              />
              {errMsg !== '' && (
                <Text style={[{ color: colors.magicPotion, paddingHorizontal: 10 }, Fonts.textSM, Fonts.textLeft]}>{errMsg}</Text>
              )}
            </View>

            <View style={[Layout.fullWidth, Layout.center, Gutters.largeVPadding, { flex: 1, justifyContent: 'space-between' }]}>
              <ActionButton
                onPress={onStartPress}
                text={t('start')}
                isLoading={isLoggingIn}
                isTransparentBackground
                containerStyle={{
                  width: '45%',
                }}
              />
              <Pressable onPress={onGetReferralCodePress} style={{ paddingBottom: 20 }}>
                <Text style={{ textDecorationLine: 'underline', color: colors.white }}>{t('getReferralCode')}</Text>
              </Pressable>
            </View>
          </KeyboardAwareScrollView>
        </ModalBox>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default EnterInvitaionCodeScreen
