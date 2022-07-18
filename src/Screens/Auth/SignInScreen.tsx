import React, { useState, useEffect, useCallback, FC, useRef } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image, Keyboard } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import EncryptedStorage from 'react-native-encrypted-storage'
// @ts-ignore
import Amplify, { Auth, Hub } from 'aws-amplify'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
import { RootState } from '@/Store'
import { Header } from '@/Components'
import { Spacing } from '@/Theme/Variables'
import LoadButton from '@/Components/Buttons/LoadButton'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
// @ts-ignore
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import backBtn from '@/Assets/Images/buttons/back.png'
import WhiteInput from '@/Components/Inputs/WhiteInput'
import AppLogo from '@/Components/Icons/AppLogo'
import { color } from 'react-native-reanimated'
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { firebase } from '@react-native-firebase/messaging'
import { showSnackbar, startLoading } from '@/Store/UI/actions'
import SocialSignInButton from '@/Components/Buttons/SocialSignInButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { emailUsernameHash, triggerSnackbar } from '@/Utils/helpers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StandardInput from '@/Components/Inputs/StandardInput'
import ModalBox, { ModalProps } from 'react-native-modalbox'
import axios from 'axios'
import crashlytics from '@react-native-firebase/crashlytics'
import TouchID from 'react-native-touch-id'
import * as Keychain from 'react-native-keychain'

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
  flexBasis: 80,
  justifyContent: 'center',
}

const ERR_MSG_TEXT: TextStyle = {
  color: colors.magicPotion,
  paddingHorizontal: 10,
  paddingTop: 4,
}

const initErrMsg = {
  email: '',
  password: '',
}

const abortController = new AbortController()

const SignInScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.logIn>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errMsg, setErrMsg] = useState({
    ...initErrMsg,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [credential, setCredential] = useState({
    email: '',
    password: '',
  })

  const [socialIdentityUser, setSocialIdentityUser] = useState(null)
  const onPasswordEyePress = () => setShowPassword(prev => !prev)

  const loginErrHandler = (err: any) => {
    switch (err.message) {
      case 'Username should be either an email or a phone number.':
      case 'Incorrect username or password.':
      case 'User does not exist.':
        setErrMsg({
          ...initErrMsg,
          email: t('error.loginInputEmpty'),
        })
        break
      case 'Password did not conform with policy: Password not long enough':
        setErrMsg({
          ...initErrMsg,
          password: t('error.passwordPolicyErr'),
        })
        break
      case 'User is not confirmed.':
        navigation.navigate(RouteStacks.validationCode, {
          email: credential.email,
          action: 'resendSignUp',
        })
        break
      default:
        crashlytics().recordError(err)
    }
  }

  useEffect(() => {
    setCredential({
      email: '',
      password: '',
    })

    const touchIdAuth = async () => {
      try {
        const keychainCred = await Keychain.getGenericPassword()
        if (keychainCred) {
          let touchIdAuthRes = await TouchID.authenticate('Authenticate with TouchID / FaceID', {
            title: 'Authentication Required', // Android
            imageColor: colors.eucalyptus, // Android
            imageErrorColor: colors.magicPotion, // Android
            sensorDescription: 'Touch sensor', // Android
            sensorErrorDescription: 'Failed', // Android
            cancelText: 'Cancel', // Android
            fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
            unifiedErrors: false, // use unified error messages (default false)
            passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
          })
          if (touchIdAuthRes) {
            dispatch(startLoading(true))

            const user = await Auth.signIn(keychainCred.username, keychainCred.password)
            let { attributes, username } = user
            let jwtToken = user?.signInUserSession?.idToken?.jwtToken

            const userProfileRes = await axios.get(config.userProfile, {
              signal: abortController.signal,
              headers: {
                Authorization: jwtToken,
              },
            })
            const { email, uuid } = userProfileRes?.data

            dispatch(
              login({
                email: attributes.email,
                username,
                uuid,
              }),
            )

            setIsLoggingIn(true)
          }
        }
      } catch (err: any) {
        loginErrHandler(err)
        dispatch(startLoading(false))
      } finally {
        setIsLoggingIn(false)
      }
    }

    touchIdAuth()

    return () => {
      abortController.abort()
    }
  }, [])

  const onLoginOptionPress = async (loginOpt: string) => {
    let currErrMsg = {
      email: '',
      password: '',
    }
    let frontendCheckFail = false
    if (credential.email === '') {
      currErrMsg.email = t('error.loginInputEmpty')
      frontendCheckFail = true
    }
    if (credential.password === '') {
      currErrMsg.password = t('error.loginInputEmpty')
      frontendCheckFail = true
    }

    if (frontendCheckFail) {
      setErrMsg(currErrMsg)
    }

    dispatch(startLoading(true))

    try {
      if (loginOpt === 'normal') {
        const user = await Auth.signIn(emailUsernameHash(credential.email), credential.password)
        let { attributes, username } = user
        let jwtToken = user?.signInUserSession?.idToken?.jwtToken

        await Keychain.setGenericPassword(emailUsernameHash(credential.email), credential.password)

        const userProfileRes = await axios.get(config.userProfile, {
          headers: {
            Authorization: jwtToken,
          },
        })
        const { email, uuid } = userProfileRes?.data

        dispatch(
          login({
            email: attributes.email,
            username,
            uuid,
          }),
        )

        setIsLoggingIn(true)
      } else if (loginOpt === 'facebook') {
        await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })
      } else if (loginOpt === 'apple') {
        await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple })
      } else if (loginOpt === 'google') {
        await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })
      }
    } catch (err: any) {
      loginErrHandler(err)
      dispatch(startLoading(false))
    } finally {
      setIsLoggingIn(false)
    }
  }

  const onCredentialFieldChange = (field: string, text: string) => {
    setCredential(prevCredential => {
      return {
        ...prevCredential,
        [field]: field === 'email' ? text.toLowerCase() : text,
      }
    })
  }

  const onForgotPasswordPress = async () => {
    navigation.navigate(RouteStacks.forgotPassword)
  }

  const goBack = () => {
    navigation.navigate(RouteStacks.welcome)
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.logIn}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter, Layout.justifyContentStart]}>
        <Header onLeftPress={goBack} headerText={t('login')} />

        <View
          style={[
            {
              height: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            Layout.fullWidth,
          ]}
        >
          <View style={{ flexBasis: 100 }}>
            <AppLogo type='white' />
          </View>

          <View style={[Layout.fullWidth, { justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 }]}>
            <Text style={[{ color: colors.darkCharcoal, fontWeight: 'bold' }, Fonts.textMD, Fonts.textCenter]}>{t('welcomeBack')} !</Text>
          </View>
        </View>

        <View style={[Layout.fullWidth, Gutters.largeHPadding, INPUT_VIEW_LAYOUT]}>
          <StandardInput
            onChangeText={text => onCredentialFieldChange('email', text)}
            value={credential.email}
            placeholder={t('email')}
            placeholderTextColor={colors.spanishGray}
          />
          {errMsg.email !== '' && <Text style={ERR_MSG_TEXT}>{errMsg.email}</Text>}
        </View>

        <View style={[Layout.fullWidth, Gutters.largeHPadding, INPUT_VIEW_LAYOUT]}>
          <StandardInput
            onChangeText={text => onCredentialFieldChange('password', text)}
            value={credential.password}
            placeholder={t('password')}
            placeholderTextColor={colors.spanishGray}
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            onPasswordEyePress={onPasswordEyePress}
          />
          {errMsg.password !== '' && <Text style={ERR_MSG_TEXT}>{errMsg.password}</Text>}
        </View>

        <View style={[Layout.fullWidth, Layout.center, Gutters.regularVPadding, { flex: 1, justifyContent: 'center' }]}>
          <TurquoiseButton
            onPress={() => onLoginOptionPress('normal')}
            text={t('logMeIn')}
            containerStyle={{
              width: '45%',
            }}
          />
          <Pressable style={[Layout.fullWidth, Layout.center, { marginBottom: 30, marginTop: 10 }]} onPress={onForgotPasswordPress}>
            <Text style={{ color: colors.darkCharcoal, textDecorationLine: 'underline' }}>{t('forgotPassword')}</Text>
          </Pressable>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.darkCharcoal }}>{t('dontHaveAnAccount')}</Text>
            <Pressable style={{ paddingLeft: 6 }} onPress={() => navigation.navigate(RouteStacks.signUp)}>
              <Text style={{ color: colors.darkCharcoal, fontWeight: 'bold' }}>{t('signUp')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SignInScreen
