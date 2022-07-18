import React, { FC, ReactChildren, useEffect } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, ImageBackground, ImageSourcePropType, Dimensions } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import { RouteStacks, RouteTopTabs } from '@/Navigators/routes'
// @ts-ignore
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'

import bg1 from '@/Assets/Images/backgrounds/bg_01.png'
import bg2 from '@/Assets/Images/backgrounds/bg_02.png'
import bg3 from '@/Assets/Images/backgrounds/bg_03.png'
import Animated, { interpolate, interpolateSharableColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useRoute } from '@react-navigation/native'

type ScreenBackgroundsProps = {
  // source: ImageSourcePropType
  children: React.ReactNode
  uri?: string
  screenName: RouteStacks | RouteTopTabs
}

// Refers to RouteStacks
const ScreenImageMap: any = {
  [RouteStacks.welcome]: 'video',
  [RouteStacks.logIn]: 'video',
  [RouteStacks.signUp]: 'video',
  [RouteStacks.enterInvitationCode]: 'video',

  [RouteStacks.validationCode]: bg2,
  [RouteStacks.forgotPassword]: bg2,
  [RouteStacks.signUpWithCode]: bg2,
  [RouteStacks.createNewPassword]: bg2,

  [RouteStacks.homeMain]: bg2,
  [RouteStacks.homeNewsDetail]: bg2,

  [RouteStacks.earningMain]: bg2,
  [RouteStacks.eventMain]: bg2,
  [RouteTopTabs.stockInfoMain]: bg2,

  [RouteStacks.setting]: bg2,
  [RouteStacks.provideEmail]: bg2,
  [RouteStacks.registrationCompleted]: bg2,
}

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const nameColorMap: {
  [K in RouteStacks as string]?: string
} = {
  [RouteStacks.homeMain]: colors.skyBlueCrayola,
  [RouteStacks.earningMain]: colors.babyBlueEyes,
  [RouteStacks.searchMain]: colors.lavendarWeb,
  [RouteTopTabs.stockInfoMain]: colors.pinkLavendar,
  [RouteStacks.eventMain]: colors.englishLavendar,
}

const ScreenBackgrounds = ({ uri, screenName, children }: ScreenBackgroundsProps) => {
  const route = useRoute()

  // if uri exists, then use uri
  let source: ImageSourcePropType = uri
    ? {
        uri,
      }
    : screenName
    ? ScreenImageMap[screenName]
    : {}

  return ScreenImageMap[screenName] === 'video' ? (
    <>
      {/* <Video
        style={{
          height: Dimensions.get('window').height,
          position: 'absolute',
          top: -10,
          left: 0,
          alignItems: 'stretch',
          bottom: 0,
          right: 0,
        }}
        source={require('../../Assets/Videos/b.mp4')}
        resizeMode='cover'
        rate={1.0}
        muted={true}
        repeat={true}
        ignoreSilentSwitch='obey'
      /> */}
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={{
          flex: 1,
        }}
        colors={['#8e9eab', '#eef2f3']}
      >
        {children}
      </LinearGradient>
    </>
  ) : (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        {children}
      </View>
    </>
  )
}

ScreenBackgrounds.defaultProps = {}

export default ScreenBackgrounds
