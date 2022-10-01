import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { StockInfoScreenNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import { getLawsuitsLiveFeed } from '@/Queries/StockInfoTab'
import map from 'lodash/map'
import axios from 'axios'
import { getNewsItemData } from '@/Queries/HomeTab'
import RenderHtml from 'react-native-render-html'
import { Skeleton } from '@rneui/themed'
import join from 'lodash/join'
import FastImage from 'react-native-fast-image'
import moment from 'moment'

const SKELETON_NEWS_CONTENT: ViewStyle = {
  marginVertical: 4,
}

const windowWidth = Dimensions.get('window').width

export type LawsuitDetailScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.lawsuitsDetail>,
  StockInfoStackScreenProps
>

export type LawsuitNewsDetail = {
  id: number
  title: string
  link: string
  imgUrl: string
  publishedAt: string
  tickers: string[]
}

const LawsuitDetailScreen: FC<LawsuitDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const { news }: { news: LawsuitNewsDetail } = route.params ?? {
    id: undefined,
    title: '',
    link: '',
    imgUrl: '',
    publishedAt: '',
    tickers: [],
  }
  const newsItemDataResult = getNewsItemData(news?.id)
  let hasImage = news?.imgUrl !== ''

  return (
    <ScreenBackgrounds screenName={RouteStacks.lawsuitsDetail}>
      <Header headerText={t('lawsuitsDetail')} onLeftPress={() => navigation.navigate(RouteStacks.lawsuits)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{}}
        contentContainerStyle={[
          Gutters.smallHPadding,
          {
            flexGrow: 1,
            justifyContent: 'flex-start',
          },
        ]}
      >
        {
          <View
            style={{
              paddingTop: 8,
            }}
          >
            {
              <View
                style={[
                  Layout.fullWidth,
                  {
                    alignItems: 'center',
                    height: 100,
                    justifyContent: 'center',
                    marginBottom: 10,
                  },
                ]}
              >
                <SharedElement style={{ width: '100%', height: '100%' }} id={`lawsuitNews.${news?.id}.image`}>
                  <FastImage
                    source={{ uri: hasImage ? news?.imgUrl : config.defaultNewsImgUrl, priority: FastImage.priority.high }}
                    resizeMode={hasImage ? 'contain' : 'cover'}
                    style={{ backgroundColor: colors.white, width: '100%', height: '100%' }}
                  />
                </SharedElement>
              </View>
            }

            <SharedElement id={`lawsuitNews.${news.id}.title`}>
              <Text style={[{ fontSize: 14, color: colors.darkBlueGray, fontWeight: 'bold' }]}>{news.title}</Text>
            </SharedElement>

            <View style={{ paddingVertical: 4 }}>
              <Text style={{ fontSize: 14, color: colors.darkBlueGray }}>{moment(news.publishedAt).format('YYYY-MM-DD')}</Text>
            </View>

            <View style={{ flexBasis: 40, width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <SharedElement id={`lawsuitNews.${news?.id}.tickers.${join(news.tickers, '-')}`}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  {map(news.tickers, (ticker: string, idx: number) => {
                    return (
                      <View
                        key={`lawsuitTicker-${idx}`}
                        style={{
                          backgroundColor: colors.darkBlueGray,
                          marginHorizontal: 4,
                          height: 30,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.white }}>${ticker}</Text>
                      </View>
                    )
                  })}
                </View>
              </SharedElement>
            </View>

            <ScrollView
              style={[
                Layout.fullWidth,
                {
                  flex: 5,
                  paddingRight: 10,
                  paddingLeft: 4,
                },
              ]}
            >
              {newsItemDataResult?.html ? (
                <RenderHtml
                  contentWidth={windowWidth}
                  source={{ html: newsItemDataResult?.html }}
                  tagsStyles={{
                    p: {
                      fontSize: 12,
                      color: colors.darkBlueGray,
                    },
                  }}
                />
              ) : (
                <>
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' width={(windowWidth * 2) / 3} height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' width={(windowWidth * 2) / 3} height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' width={windowWidth / 2} height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                  <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={10} />
                </>
              )}
            </ScrollView>
          </View>
        }
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default LawsuitDetailScreen
