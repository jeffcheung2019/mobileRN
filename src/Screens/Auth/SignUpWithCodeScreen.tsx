import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  Alert,
  ViewStyle,
  ImageBackground,
  Linking,
  Image,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Header } from '@/Components'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import AppLogo from '@/Components/Icons/AppLogo'
import AppIcon from '@/Components/Icons/AppIcon'
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import notifee from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SocialSignInButton from '@/Components/Buttons/SocialSignInButton'
import { startLoading } from '@/Store/UI/actions'
// @ts-ignore
import { Auth } from 'aws-amplify'
// @ts-ignore
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

import googleIcon from '@/Assets/Images/icons/google.png'
import appleIcon from '@/Assets/Images/icons/apple.png'
import facebookIcon from '@/Assets/Images/icons/facebook.png'
import crashlytics from '@react-native-firebase/crashlytics'

const BUTTON_VIEW = {
  marginVertical: 20,
}

const images = [
  {
    // Simplest usage.
    url: 'https://i0.wp.com/www.vetbossel.in/wp-content/uploads/2020/02/first-screen.png?fit=485%2C1024',

    width: 300,
    height: 300,
    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
      // headers: ...
    },
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFwd09mAFWnK_RwdHVjqs6PI76iPyksB6PgbJozABNl8yOAEeaCOTxO-qbbbiaYJebC3k&usqp=CAU',
    // props: {
    //     // Or you can set source directory.
    //     source: require('../background.png')
    // }
  },
]

const SignUpWithCodeScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.signUpWithCode>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [errMsg, setErrMsg] = useState(' ')
  const [credential, setCredential] = useState({
    username: '',
    password: '',
  })

  const onDisplayNotification = async () => {
    // Create a channel
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      })

      // Display a notification
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
        },
      })
    } catch (err: any) {
      crashlytics().recordError(err)
    }
  }

  const onSignInPress = () => {
    navigation.navigate(RouteStacks.logIn)
  }

  const onLoginOptionPress = async (loginOpt: string) => {
    dispatch(startLoading(true))
    try {
      if (loginOpt === 'facebook') {
        await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })
      } else if (loginOpt === 'apple') {
        await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple })
      } else if (loginOpt === 'google') {
        await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })
      }
    } catch (err: any) {
      switch (err.message) {
        case 'Username should be either an email or a phone number.':
          setErrMsg(err.message)
          break
        case 'Password did not conform with policy: Password not long enough':
          setErrMsg(err.message)
          break
        case 'User is not confirmed.':
          setErrMsg(err.message)
          break
        case 'Incorrect username or password.':
          setErrMsg(err.message)
          break
        case 'Username cannot be empty':
          setErrMsg(err.message)
          break
        case 'User does not exist.':
          setErrMsg(t('error.invalidUser'))
          break
        default:
      }
      dispatch(startLoading(false))
    } finally {
      setIsLoggingIn(false)
    }
  }

  const onSignUpPress = () => {
    navigation.navigate(RouteStacks.signUp)
  }

  const goBack = () => navigation.goBack()

  return (
    <ScreenBackgrounds screenName={RouteStacks.signUpWithCode}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}>
        <Header headerText={t('createNewAccount')} onLeftPress={goBack} />
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            flex: 1,
            justifyContent: 'space-around',
            paddingVertical: 10,
          }}
        >
          <AppLogo
            style={{
              height: '25%',
            }}
            type='white'
          />

          <View
            style={[
              {
                flexGrow: 5,
                justifyContent: 'center',
              },
              Layout.fullWidth,
              Layout.fill,
            ]}
          >
            <View style={[Layout.fullWidth, Gutters.smallVMargin, Layout.center]}>
              <Pressable
                onPress={() => onLoginOptionPress('google')}
                style={{
                  width: '80%',
                  backgroundColor: colors.cornflowerBlue,
                  borderRadius: 99,
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  height: 44,
                  alignItems: 'center',
                }}
              >
                <Image source={googleIcon} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                <Text style={{ color: colors.white, marginLeft: 20, flex: 1, textAlign: 'center' }}>
                  {t('continueWithGoogleAllCapital')}
                </Text>
              </Pressable>
            </View>

            <View style={[Layout.fullWidth, Gutters.smallVMargin, Layout.center]}>
              <Pressable
                onPress={() => onLoginOptionPress('facebook')}
                style={{
                  width: '80%',
                  backgroundColor: colors.glaucous,
                  borderRadius: 99,
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  height: 44,
                  alignItems: 'center',
                }}
              >
                <Image source={facebookIcon} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                <Text style={{ color: colors.white, marginLeft: 20, flex: 1, textAlign: 'center' }}>
                  {t('continueWithFacebookAllCapital')}
                </Text>
              </Pressable>
            </View>

            <View style={[Layout.fullWidth, Gutters.smallVMargin, Layout.center]}>
              <Pressable
                onPress={() => onLoginOptionPress('apple')}
                style={{
                  width: '80%',
                  backgroundColor: colors.white,
                  borderRadius: 99,
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  height: 44,
                  alignItems: 'center',
                }}
              >
                <Image source={appleIcon} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                <Text style={{ color: colors.black, marginLeft: 20, flex: 1, textAlign: 'center' }}>
                  {t('continueWithAppleAllCapital')}
                </Text>
              </Pressable>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={Fonts.textMD}>{t('or')}</Text>
            </View>

            <View style={[Layout.fullWidth, Gutters.smallVMargin, Layout.center]}>
              <Pressable
                onPress={() => navigation.navigate(RouteStacks.signUp)}
                style={{
                  width: '80%',
                  backgroundColor: colors.white,
                  borderRadius: 99,
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  height: 44,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.black, textAlign: 'center', width: '100%' }}>{t('signUpWithEmail')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SignUpWithCodeScreen
