import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
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
  useWindowDimensions,
  Image,
  Dimensions,
  Platform,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Header } from '@/Components'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TabView, SceneMap, Route } from 'react-native-tab-view'
import slide1Bg from '@/Assets/Images/Gallery/slide1_bg.png'
import slide2Bg from '@/Assets/Images/Gallery/slide2_bg.png'
import slide3Bg from '@/Assets/Images/Gallery/slide3_bg.png'
import slide4Bg from '@/Assets/Images/Gallery/slide4_bg.png'
import slide1 from '@/Assets/Images/Gallery/slider1_img.png'
import slide2 from '@/Assets/Images/Gallery/slider2_img.png'
import slide3 from '@/Assets/Images/Gallery/slider3_img.png'
import slide4 from '@/Assets/Images/Gallery/slider4_img.png'
import Dots from 'react-native-dots-pagination'
import slideDragon from '@/Assets/Images/Gallery/slider4_dragon.png'

const windowHeight = Dimensions.get('window').height

const slideBgMap = [slide1Bg, slide2Bg, slide3Bg, slide4Bg]

const slideMap = [slide1, slide2, slide3, slide4]

type ScreenProps = {
  screenIdx: number
}

const Screen: FC<ScreenProps> = ({ screenIdx }) => {
  const { t } = useTranslation()

  return (
    <ImageBackground
      source={slideBgMap[screenIdx]}
      style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 5, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text
            style={[
              {
                color: colors.eucalyptus,
                fontSize: 24,
                fontWeight: 'bold',
                fontFamily: 'AvenirNext-Bold',
                textAlign: 'center',
                paddingBottom: 20,
              },
            ]}
          >
            {t(`gallerySlides.slide${screenIdx}Title`)
              .split('')
              .join('\u200A'.repeat(Platform.OS === 'ios' ? 14 : 2))}
          </Text>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={[
                {
                  color: colors.white,
                  fontSize: 24,
                  fontWeight: 'bold',
                  fontFamily: 'AvenirNext-Bold',
                  textAlign: 'center',
                },
              ]}
            >
              {t(`gallerySlides.slide${screenIdx}Desc`)}
              {screenIdx === 0 && <Text style={{ color: colors.eucalyptus }}>{t('extra')}</Text>}
            </Text>
          </View>
        </View>
        <View style={{ flex: 13, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={slideMap[screenIdx]} style={{ height: '95%', resizeMode: 'contain' }} />
          {screenIdx === 3 && <Image source={slideDragon} style={{ position: 'absolute', top: 0, left: 0 }} />}
        </View>

        <View style={{ flex: 4 }}></View>
      </View>
    </ImageBackground>
  )
}

const WelcomeGalleryScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.welcomeGallery>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const layout = useWindowDimensions()
  const [screenIdx, setScreenIdx] = useState(0)
  const [screens] = useState([{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }])

  let screen1 = useMemo(() => <Screen screenIdx={0} />, [])
  let screen2 = useMemo(() => <Screen screenIdx={1} />, [])
  let screen3 = useMemo(() => <Screen screenIdx={2} />, [])
  let screen4 = useMemo(() => <Screen screenIdx={3} />, [])

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case '1':
        return screen1
      case '2':
        return screen2
      case '3':
        return screen3
      case '4':
        return screen4
      default:
        return null
    }
  }

  const onEnterPress = async () => {
    await AsyncStorage.setItem('firstVisit', 'false')
    navigation.navigate(RouteStacks.welcome)
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
      <View
        style={[
          Layout.fullWidth,
          Layout.rowCenter,
          {
            flex: 10,
          },
        ]}
      >
        <TabView
          style={{
            width: '100%',
            height: '100%',
          }}
          lazy
          lazyPreloadDistance={10}
          renderTabBar={() => null}
          navigationState={{ index: screenIdx, routes: screens }}
          renderScene={renderScene}
          onIndexChange={setScreenIdx}
          initialLayout={{ width: layout.width }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: '18%',
          minHeight: 100,
          width: '100%',
        }}
      >
        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 2,
            },
          ]}
        >
          <Dots
            length={4}
            active={screenIdx}
            activeColor={colors.eucalyptus}
            marginHorizontal={8}
            inactiveColor={colors.lightSlateGray}
            passiveDotWidth={8}
            pasiveDotHeight={8}
            activeDotWidth={12}
            activeDotHeight={12}
          />
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 3,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}
        >
          <TurquoiseButton
            onPress={onEnterPress}
            text={t('getStarted')}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default WelcomeGalleryScreen
