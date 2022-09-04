import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Header } from '@/Components'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
// @ts-ignore
import Amplify, { Auth } from 'aws-amplify'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import ActionButton from '@/Components/Buttons/ActionButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { startLoading } from '@/Store/UI/actions'
import axios from 'axios'
import { emailUsernameHash, triggerSnackbar } from '@/Utils/helpers'
import crashlytics from '@react-native-firebase/crashlytics'
import CountDown from 'react-native-countdown-component'
import verificationGif from '@/Assets/Images/Illustrations/verification.gif'

const TEXT_INPUT = {
  height: 40,
  color: 'yellow',
  borderWidth: 1,
  borderRadius: 10,
  borderColor: '#000',
}

const BUTTON_ICON = {
  width: 30,
}

const BUTTON_TEXT: TextStyle = {
  width: 100,
}

const CONTENT_ELEMENT_WRAPPER: ViewStyle = {
  justifyContent: 'center',
  padding: 2,
  width: '90%',
}

const CODE_FIELD_ROOT = {}

const CELL: TextStyle = {
  width: 50,
  height: 50,
  fontSize: 24,
  borderWidth: 1,
  color: colors.darkBlueGray,
  backgroundColor: colors.brightGray,
  borderRadius: 4,
  textAlign: 'center',
  lineHeight: 48,
}

const FOCUSED_CELL = {
  borderWidth: 1,
  borderColor: colors.darkBlueGray,
}

// TBD: set to 60s later
const resendVeriCodeTime = 30

const VerificationCodeScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.validationCode>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route!.params || { email: '', action: '' }
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
  const [validationCode, setValidationCode] = useState('')
  const ref = useBlurOnFulfill({ value: validationCode, cellCount: 6 })
  const [errMsg, setErrMsg] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [canResendVeriCode, setCanResendVeriCode] = useState(false)
  const [currUntil, setCurrUntil] = useState(resendVeriCodeTime)
  const [countDownKey, setCountDownKey] = useState(new Date().toTimeString())
  const [focusCellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: validationCode,
    setValue: setValidationCode,
  })

  useEffect(() => {
    const run = async () => {
      if (params.action === 'resendSignUp') {
        await Auth.resendSignUp(emailUsernameHash(params.email))
      }
    }

    run()
  }, [params])

  const onVerifyAccountPress = useCallback(async () => {
    if (validationCode.length !== 6) {
      setErrMsg(t('error.invalidVerificationCode'))
      return
    }

    if (params.action === 'forgotPassword') {
      navigation.navigate(RouteStacks.createNewPassword, {
        validationCode,
        email: params.email,
      })
    } else if (params.action === 'registerEmail') {
      try {
        dispatch(startLoading(true))

        let user = await Auth.currentAuthenticatedUser()
        let jwtToken = user.signInUserSession.idToken.jwtToken

        // let [referralConfirmationRes, userProfileRes] = await Promise.all([
        //   axios.post(
        //     config.emailVerification,
        //     {
        //       emailVerificationCode: validationCode,
        //     },
        //     {
        //       headers: {
        //         Authorization: jwtToken, //the token is a variable which holds the token
        //       },
        //     },
        //   ),
        //   axios.get(config.userProfile, {
        //     headers: {
        //       Authorization: jwtToken, //the token is a variable which holds the token
        //     },
        //   }),
        // ])

        // const { email, uuid } = userProfileRes?.data

        dispatch(
          login({
            email: params.email,
            username: user.username,
            // uuid,
          }),
        )
      } catch (err: any) {
        //crashlytics().recordError(err)
        setErrMsg(t('error.invalidVerificationCode'))
      } finally {
        dispatch(startLoading(false))
      }
    } else {
      if (params.email === '') {
        Alert.alert('Email is empty')
        navigation.goBack()
        return
      }
      setErrMsg('')
      try {
        dispatch(startLoading(true))
        await Auth.confirmSignUp(emailUsernameHash(params.email), validationCode)
        navigation.navigate(RouteStacks.registrationCompleted)
      } catch (err: any) {
        //crashlytics().recordError(err)
        setErrMsg(err.message)
      } finally {
        dispatch(startLoading(false))
      }
    }
  }, [validationCode, params, newPassword])

  const onPasswordChange = (text: string) => {
    setNewPassword(text)
  }

  const goBack = () => {
    navigation.goBack()
  }

  const onFinish = () => {
    setCanResendVeriCode(true)
  }

  const onResendVerificationCodePress = async () => {
    if (!canResendVeriCode) return
    dispatch(startLoading(true))
    try {
      setCurrUntil(resendVeriCodeTime)
      setCanResendVeriCode(false)
      setCountDownKey(new Date().toTimeString())
      if (params.action === 'forgotPassword') {
        await Auth.forgotPassword(emailUsernameHash(params.email))
      } else if (params.action === 'registerEmail') {
        let user = await Auth.currentAuthenticatedUser()
        let jwtToken = user.signInUserSession.idToken.jwtToken

        await axios.post(
          config.userProfile,
          {
            email: params.email.toLowerCase(),
          },
          {
            headers: {
              Authorization: jwtToken,
            },
          },
        )
      } else {
        await Auth.resendSignUp(emailUsernameHash(params.email))
      }
    } catch (err: any) {
      switch (err.message) {
        case 'Attempt limit exceeded, please try after some time.':
        default:
          setErrMsg(err.message)
          break
      }
    } finally {
      dispatch(startLoading(false))
    }
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.validationCode}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}>
        <Header onLeftPress={goBack} headerText={t('emailVerificationCode')} withProfile={false} />
        <View
          style={[
            {
              flexGrow: 6,
            },
            Layout.fullWidth,
            Layout.fill,
            Layout.colCenter,
          ]}
        >
          <View
            style={{
              flex: 4,
            }}
          >
            <Image
              source={verificationGif}
              style={{
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>

          <View
            style={{
              flex: 5,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <View
              style={[
                CONTENT_ELEMENT_WRAPPER,
                { flexBasis: 100, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' },
              ]}
            >
              <View style={{ justifyContent: 'center', height: '100%' }}>
                <CountDown
                  key={countDownKey}
                  until={currUntil}
                  digitStyle={{ backgroundColor: 'transparent' }}
                  digitTxtStyle={{ color: colors.darkBlueGray, fontSize: 18, height: 30, fontWeight: '400' }}
                  timeLabels={{}}
                  size={10}
                  separatorStyle={{ height: 25, fontSize: 14, color: colors.darkBlueGray }}
                  timeToShow={['M', 'S']}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                    marginRight: 10,
                    display: canResendVeriCode ? 'none' : 'flex',
                  }}
                  showSeparator
                  onFinish={onFinish}
                />
              </View>
              <View style={{ justifyContent: 'center', height: '100%' }}>
                <Pressable onPress={onResendVerificationCodePress}>
                  <Text
                    style={[
                      {
                        color: colors.darkBlueGray,
                        lineHeight: 26,
                        fontSize: 14,
                        textDecorationLine: canResendVeriCode ? 'underline' : 'none',
                      },
                      Fonts.textLeft,
                    ]}
                  >
                    {t('resendVerificationCode')}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 80, justifyContent: 'flex-start' }]}>
              <CodeField
                ref={ref}
                value={validationCode}
                onChangeText={setValidationCode}
                cellCount={6}
                rootStyle={CODE_FIELD_ROOT}
                keyboardType='number-pad'
                textContentType='oneTimeCode'
                renderCell={({ index, symbol, isFocused }) => (
                  <Text key={index} style={[CELL, isFocused && FOCUSED_CELL]} onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>

            <View style={[CONTENT_ELEMENT_WRAPPER, { flex: 1, justifyContent: 'flex-start' }]}>
              {errMsg !== '' && (
                <Text style={[{ color: colors.magicPotion, paddingHorizontal: 10 }, Fonts.textSM, Fonts.textLeft]}>{errMsg}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={[Layout.fullWidth, Layout.center, { paddingHorizontal: 30, flex: 1, justifyContent: 'flex-start' }]}>
          <ActionButton
            text={t('confirm')}
            isLoading={isVerifyingAccount}
            onPress={onVerifyAccountPress}
            containerStyle={{
              width: '105%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default VerificationCodeScreen
