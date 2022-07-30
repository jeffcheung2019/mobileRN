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
import ActionButton from '@/Components/Buttons/ActionButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TabView, SceneMap } from 'react-native-tab-view'
import slide1Bg from '@/Assets/Images/Gallery/slide1_bg.png'
import slide2Bg from '@/Assets/Images/Gallery/slide2_bg.png'
import slide3Bg from '@/Assets/Images/Gallery/slide3_bg.png'
import slide4Bg from '@/Assets/Images/Gallery/slide4_bg.png'
import slide1 from '@/Assets/Images/Gallery/slider1_img.png'
import slide2 from '@/Assets/Images/Gallery/slider2_img.png'
import slide3 from '@/Assets/Images/Gallery/slider3_img.png'
import slide4 from '@/Assets/Images/Gallery/slider4_img.png'
import Dots from 'react-native-dots-pagination'

const windowHeight = Dimensions.get('window').height

const Screen1: FC<any> = ({ Layout, t, onEnterPress }) => {
  return (
    <ImageBackground
      source={slide1Bg}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 6,
              flexDirection: 'column',
              paddingHorizontal: 16,
              justifyContent: 'flex-end',
            },
          ]}
        >
          <Text
            style={[
              Layout.fullWidth,
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
            {t(`gallerySlides.slide0Title`).split('').join('\u200A'.repeat(14))}
          </Text>
          <Text
            style={[
              Layout.fullWidth,
              { color: colors.white, fontSize: 28, fontWeight: 'bold', fontFamily: 'AvenirNext-Bold', textAlign: 'center' },
            ]}
          >
            {t(`gallerySlides.slide0Desc`)}
            {<Text style={{ color: colors.eucalyptus }}>{t('extra')}</Text>}
          </Text>
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 12,
              paddingTop: 20,
            },
          ]}
        >
          <Image source={slide1} style={{ height: '100%', resizeMode: 'contain' }} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 3,
            },
          ]}
        >
          <Dots length={4} active={0} activeColor={colors.eucalyptus} marginHorizontal={8} inactiveColor={colors.lightSlateGray} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 4,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}
        >
          <ActionButton
            onPress={onEnterPress}
            text={t('getStarted')}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

const Screen2: FC<any> = ({ Layout, t, onEnterPress }) => {
  return (
    <ImageBackground
      source={slide2Bg}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 6,
              flexDirection: 'column',
              paddingHorizontal: 16,
              justifyContent: 'flex-end',
            },
          ]}
        >
          <Text
            style={[
              Layout.fullWidth,
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
            {t(`gallerySlides.slide1Title`).split('').join('\u200A'.repeat(14))}
          </Text>
          <Text
            style={[
              Layout.fullWidth,
              { color: colors.white, fontSize: 28, fontWeight: 'bold', fontFamily: 'AvenirNext-Bold', textAlign: 'center' },
            ]}
          >
            {t(`gallerySlides.slide1Desc`)}
          </Text>
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 12,
              paddingTop: 20,
            },
          ]}
        >
          <Image source={slide2} style={{ height: '100%', resizeMode: 'contain' }} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 3,
            },
          ]}
        >
          <Dots length={4} active={1} activeColor={colors.eucalyptus} marginHorizontal={8} inactiveColor={colors.lightSlateGray} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 4,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}
        >
          <ActionButton
            onPress={onEnterPress}
            text={t('getStarted')}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

const Screen3: FC<any> = ({ Layout, t, onEnterPress, slide, slideBg }) => {
  return (
    <ImageBackground
      source={slide3Bg}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 6,
              flexDirection: 'column',
              paddingHorizontal: 16,
              justifyContent: 'flex-end',
            },
          ]}
        >
          <Text
            style={[
              Layout.fullWidth,
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
            {t(`gallerySlides.slide2Title`).split('').join('\u200A'.repeat(14))}
          </Text>
          <Text
            style={[
              Layout.fullWidth,
              { color: colors.white, fontSize: 28, fontWeight: 'bold', fontFamily: 'AvenirNext-Bold', textAlign: 'center' },
            ]}
          >
            {t(`gallerySlides.slide2Desc`)}
          </Text>
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 12,
              paddingTop: 20,
            },
          ]}
        >
          <Image source={slide3} style={{ height: '100%', resizeMode: 'contain' }} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 3,
            },
          ]}
        >
          <Dots length={4} active={2} activeColor={colors.eucalyptus} marginHorizontal={8} inactiveColor={colors.lightSlateGray} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 4,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}
        >
          <ActionButton
            onPress={onEnterPress}
            text={t('getStarted')}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

const Screen4: FC<any> = ({ Layout, t, onEnterPress }) => {
  return (
    <ImageBackground
      source={slide4Bg}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 6,
              flexDirection: 'column',
              paddingHorizontal: 16,
              justifyContent: 'flex-end',
            },
          ]}
        >
          <Text
            style={[
              Layout.fullWidth,
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
            {t(`gallerySlides.slide3Title`)}
          </Text>
          <Text
            style={[
              Layout.fullWidth,
              { color: colors.white, fontSize: 28, fontWeight: 'bold', fontFamily: 'AvenirNext-Bold', textAlign: 'center' },
            ]}
          >
            {t(`gallerySlides.slide3Desc`)}
          </Text>
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 12,
              paddingTop: 20,
            },
          ]}
        >
          <Image source={slide4} style={{ height: '100%', resizeMode: 'contain' }} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            Layout.rowCenter,
            {
              flex: 3,
            },
          ]}
        >
          <Dots length={4} active={3} activeColor={colors.eucalyptus} marginHorizontal={8} inactiveColor={colors.lightSlateGray} />
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 4,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}
        >
          <ActionButton
            onPress={onEnterPress}
            text={t('getStarted')}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

const Screen: FC<any> = ({ Layout, t, onEnterPress, screenIdx, slide, slideBg }) => {
  console.log('screenIdx ', screenIdx)

  return (
    <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
      <View
        style={[
          Layout.fullWidth,
          Layout.rowCenter,
          {
            flex: 6,
            flexDirection: 'column',
            paddingHorizontal: 16,
            justifyContent: 'flex-end',
          },
        ]}
      >
        <Text
          style={[
            Layout.fullWidth,
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
          {t(`gallerySlides.slide${screenIdx}Title`).split('').join('\u200A'.repeat(14))}
        </Text>
        <Text
          style={[
            Layout.fullWidth,
            { color: colors.white, fontSize: 28, fontWeight: 'bold', fontFamily: 'AvenirNext-Bold', textAlign: 'center' },
          ]}
        >
          {t(`gallerySlides.slide${screenIdx}Desc`)}
          {screenIdx === 0 && <Text style={{ color: colors.eucalyptus }}>{t('extra')}</Text>}
        </Text>
      </View>

      <View
        style={[
          Layout.fullWidth,
          Layout.rowCenter,
          {
            flex: 12,
            paddingTop: 20,
          },
        ]}
      >
        <Image source={slide} style={{ height: '100%', resizeMode: 'contain' }} />
      </View>

      <View
        style={[
          Layout.fullWidth,
          Layout.rowCenter,
          {
            flex: 3,
          },
        ]}
      >
        <Dots length={4} active={screenIdx} activeColor={colors.eucalyptus} marginHorizontal={8} inactiveColor={colors.lightSlateGray} />
      </View>

      <View
        style={[
          Layout.fullWidth,
          {
            flex: 4,
            justifyContent: 'flex-start',
            alignItems: 'center',
          },
        ]}
      >
        <ActionButton
          onPress={onEnterPress}
          text={t('getStarted')}
          containerStyle={{
            width: '45%',
          }}
        />
      </View>
    </KeyboardAwareScrollView>
    // </ImageBackground>
  )
}

const slideBgMap = [slide1Bg, slide2Bg, slide3Bg, slide4Bg]

const WelcomeGalleryScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.welcomeGallery>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const layout = useWindowDimensions()
  const [screenIdx, setScreenIdx] = useState(0)
  const [screens] = useState([
    { key: '1', title: '1' },
    { key: '2', title: '2' },
    { key: '3', title: '3' },
    { key: '4', title: '4' },
  ])

  const renderScene = SceneMap({
    '1': () => <Screen1 Layout={Layout} t={t} screenIdx={0} onEnterPress={onEnterPress} />,
    '2': () => <Screen2 Layout={Layout} t={t} screenIdx={1} onEnterPress={onEnterPress} />,
    '3': () => <Screen3 Layout={Layout} t={t} screenIdx={2} onEnterPress={onEnterPress} />,
    '4': () => <Screen4 Layout={Layout} t={t} screenIdx={3} onEnterPress={onEnterPress} />,
  })

  const onEnterPress = async () => {
    navigation.navigate(RouteStacks.welcomeBack)
  }

  const onTabViewIndexChange = (idx: number) => {
    setScreenIdx(idx)
  }

  return (
    <ImageBackground
      source={slideBgMap[screenIdx]}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fullSize, Layout.colCenter]}>
        {/* <View style={[Layout.fullWidth, Layout.rowCenter, {
                    flex: 10,
                    flexDirection: "column",
                    paddingHorizontal: 16
                }]}>
                    <Text style={[
                        Layout.fullWidth,
                        {
                            color: colors.eucalyptus,
                            fontSize: 24,
                            fontWeight: "bold",
                            fontFamily: "AvenirNext-Bold",
                            textAlign: "center",
                            paddingBottom: 20
                        }
                    ]}>
                        {t(`gallerySlides.slide${screenIdx}Title`).split("").join('\u200A'.repeat(14))}

                    </Text>
                    <Text style={[
                        Layout.fullWidth,
                        { color: colors.white, fontSize: 28, fontWeight: "bold", fontFamily: "AvenirNext-Bold", textAlign: "center" }
                    ]}>
                        {t(`gallerySlides.slide${screenIdx}Desc`)}
                        {
                            screenIdx === 0 && <Text style={{ color: colors.eucalyptus }}>{t('extra')}</Text>
                        }
                    </Text>
                </View> */}

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
            lazyPreloadDistance={2}
            renderTabBar={() => null}
            navigationState={{ index: screenIdx, routes: screens }}
            renderScene={renderScene}
            onIndexChange={onTabViewIndexChange}
            initialLayout={{ width: layout.width }}
          />
        </View>

        {/* <View style={[Layout.fullWidth, Layout.rowCenter, {
                    flex: 3,
                }]}>
                    <Dots length={4} active={screenIdx} activeColor={colors.eucalyptus}
                        marginHorizontal={8}
                        inactiveColor={colors.lightSlateGray} />
                </View>

                <View style={[Layout.fullWidth, {
                    flex: 4,
                    justifyContent: "flex-start",
                    alignItems: 'center'

                }]}>
                    <ActionButton
                        onPress={onEnterPress}
                        text={t("getStarted")}
                        containerStyle={{
                            width: "45%"
                        }}
                    />
                </View> */}
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

export default WelcomeGalleryScreen
