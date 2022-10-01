import React, { useEffect, Ref } from 'react'
import { Dimensions, Image, ImageBackground, Linking, Pressable, StatusBar, Text, View } from 'react-native'
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack'
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
  NavigationContainerRefWithCurrent,
  useNavigation,
} from '@react-navigation/native'
import { AppSplashScreen } from '@/Screens'
import { useTheme } from '@/Hooks'
import MainStackNavigator from './MainStackNavigator'
import { navigationRef } from './utils'
import AuthNavigator, { AuthNavigatorParamList } from './AuthNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { UserState } from '@/Store/Users/reducer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
// @ts-ignore
import { Auth } from 'aws-amplify'
import { login } from '@/Store/Users/actions'
import messaging from '@react-native-firebase/messaging'
import { RouteStacks } from './routes'
import firebase from '@react-native-firebase/app'
import LoadingScreen from '@/Components/LoadingScreen'
import { UIState } from '@/Store/UI/reducer'
import { privateLinking, publicLinking, publicNavigationRef, privateNavigationRef } from './LinkingOptions'
import { startLoading } from '@/Store/UI/actions'
// @ts-ignore
import SnackBar from 'react-native-snackbar-component'
import { RootState } from '@/Store'
import SnackbarMsgContainer from '@/Components/SnackbarMsgContainer'
import { colors, config } from '@/Utils/constants'
import crashlytics from '@react-native-firebase/crashlytics'
// @ts-ignore
import Video from 'react-native-video'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import axios, { CancelTokenSource } from 'axios'
// @ts-ignore
import { Hub } from 'aws-amplify'
import WelcomeGalleryScreen from '@/Screens/Auth/WelcomeGalleryScreen'
import { WelcomeScreen } from '@/Screens/Auth'
import RNBootSplash from 'react-native-bootsplash'
import times from 'lodash/times'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { SafeAreaView } from 'react-native-safe-area-context'
export type ApplicationNavigatorParamList = {
  [RouteStacks.mainStack]: undefined
}
const Stack = createSharedElementStackNavigator<ApplicationNavigatorParamList>()

let abortController = new AbortController()
// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { isScreenLoading, snackBarConfig } = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  let { isLoggedIn } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const retrieveLoggedInUser = async () => {
      try {
        let user = await Auth.currentAuthenticatedUser()
        if (user === null) {
          return
        }

        let { attributes, username } = user

        let jwtToken = user?.signInUserSession?.idToken?.jwtToken
        const userProfileRes = await axios.get(config.userProfile, {
          signal: abortController.signal,
          headers: {
            Authorization: jwtToken, //the token is a variable which holds the token
          },
        })

        const { email, uuid } = userProfileRes?.data

        if (email) {
          dispatch(
            login({
              username: username,
              email: attributes.email,
            }),
          )
          dispatch(startLoading(false))
        } else {
          publicNavigationRef.navigate(RouteStacks.provideEmail)
          dispatch(startLoading(false))
        }
      } catch (err: any) {
        //crashlytics().recordError(err)
      } finally {
        dispatch(startLoading(false))
      }
    }

    if (!isLoggedIn) {
      retrieveLoggedInUser()
    }

    return () => {
      // abortController.abort()
    }
  }, [isLoggedIn])

  let navProps: {
    ref: Ref<NavigationContainerRef<ApplicationNavigatorParamList>>
    linking: LinkingOptions<ApplicationNavigatorParamList>
  } = isLoggedIn
    ? {
        ref: privateNavigationRef,
        linking: privateLinking,
      }
    : {
        ref: publicNavigationRef,
        linking: publicLinking,
      }

  useEffect(() => {
    const getUser = () => {
      return Auth.currentAuthenticatedUser()
        .then((userData: any) => userData)
        .catch(() => {})
    }

    const authListener = async ({ payload: { event, data } }: any) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          try {
            let userData = await getUser()
            let jwtToken = userData?.signInUserSession?.idToken?.jwtToken
            // const userProfileRes = await axios.get(config.userProfile, {
            //   signal: abortControllers[1].signal,
            //   headers: {
            //     Authorization: jwtToken,
            //   },
            // })

            // const { email, uuid } = userProfileRes?.data

            console.log('userData', userData)

            if (userData) {
              dispatch(
                login({
                  username: userData.username,
                  email: userData.email,
                }),
              )
              dispatch(startLoading(false))
            } else {
              publicNavigationRef.navigate(RouteStacks.provideEmail)
              dispatch(startLoading(false))
            }
          } catch (err: any) {
            //crashlytics().recordError(err)
          }
          break
        case 'signOut':
          break
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          dispatch(startLoading(false))
          break
        default:
          break
      }
    }

    Hub.listen('auth', authListener)

    return () => {
      Hub.remove('auth', authListener)
    }
  }, [])

  return (
    <SafeAreaView edges={['right', 'top', 'left']} style={[Layout.fullSize, { opacity: 1 }]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SnackBar
          {...snackBarConfig}
          textMessage={() => {
            return <SnackbarMsgContainer textMessage={snackBarConfig.textMessage} />
          }}
          containerStyle={{
            borderRadius: 10,
          }}
          top={10}
          left={10}
          right={10}
        ></SnackBar>
        <NavigationContainer
          theme={NavigationTheme}
          {...navProps}
          onReady={() => {
            RNBootSplash.hide({ fade: true })
          }}
        >
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          {isScreenLoading && <LoadingScreen />}

          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              presentation: 'transparentModal',
              gestureEnabled: false,
            }}
            initialRouteName={RouteStacks.mainStack}
          >
            <Stack.Screen name={RouteStacks.mainStack} component={isLoggedIn ? MainStackNavigator : AuthNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
