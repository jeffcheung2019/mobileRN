import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { FC, useEffect, useState } from 'react'
import {
  SignInScreen,
  SignUpScreen,
  VerificationCodeScreen,
  RegistrationCompletedScreen,
  WelcomeGalleryScreen,
  ForgotPasswordScreen,
  WelcomeScreen,
  CreateNewPasswordScreen,
} from '@/Screens/Auth'
import { RouteStacks } from '@/Navigators/routes'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/Store/Users/actions'
import EnterInvitaionCodeScreen from '@/Screens/Auth/EnterInvitaionCodeScreen'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { navigationRef } from './utils'
import { CompositeScreenProps, LinkingOptions, NavigationContainerRefWithCurrent, Route } from '@react-navigation/native'
import ProvideEmailScreen from '@/Screens/Auth/ProvideEmailScreen'
import { ApplicationNavigatorParamList } from './Application'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { ApplicationStartupContainer } from '@/Screens'

type ValidationCodeParam = {
  email: string
  action: 'forgotPassword' | 'signUp' | 'resendSignUp' | 'registerEmail'
  code?: string
}

export type AuthNavigatorParamList = {
  [RouteStacks.authSplashScreen]: undefined
  [RouteStacks.welcomeGallery]: undefined
  [RouteStacks.welcome]: undefined
  [RouteStacks.signUp]: { code?: string } | undefined
  [RouteStacks.logIn]: undefined
  [RouteStacks.validationCode]: ValidationCodeParam | undefined
  [RouteStacks.forgotPassword]: undefined
  [RouteStacks.signUpWithCode]: undefined
  [RouteStacks.createNewPassword]: { validationCode: string; email: string }
  [RouteStacks.provideEmail]: undefined
  [RouteStacks.registrationCompleted]: undefined
  // 🔥 Your screens go here
}
const Stack = createSharedElementStackNavigator<AuthNavigatorParamList>()

export type ApplicationScreenProps = StackScreenProps<ApplicationNavigatorParamList, RouteStacks.mainStack>

const AuthNavigator: FC<ApplicationScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
      }}
      initialRouteName={RouteStacks.authSplashScreen}
    >
      <Stack.Screen name={RouteStacks.welcomeGallery} component={WelcomeGalleryScreen} />
      <Stack.Screen
        name={RouteStacks.authSplashScreen}
        component={ApplicationStartupContainer}
        sharedElements={(route, otherRoute, showing) => {
          const { news } = route.params
          return [
            {
              id: `app.icon`,
              animation: 'move',
            },
          ]
        }}
      />
      <Stack.Screen
        name={RouteStacks.welcome}
        component={WelcomeScreen}
        sharedElements={(route, otherRoute, showing) => {
          return [
            {
              id: `app.icon`,
              animation: 'fade',
            },
          ]
        }}
      />
      <Stack.Screen name={RouteStacks.logIn} component={SignInScreen} />
      <Stack.Screen name={RouteStacks.signUp} component={SignUpScreen} />
      <Stack.Screen name={RouteStacks.validationCode} component={VerificationCodeScreen} />
      <Stack.Screen name={RouteStacks.forgotPassword} component={ForgotPasswordScreen} />
      <Stack.Screen name={RouteStacks.createNewPassword} component={CreateNewPasswordScreen} />
      <Stack.Screen name={RouteStacks.registrationCompleted} component={RegistrationCompletedScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
