import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { FadeInDown, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { StockInfoScreenNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import { getLawsuitsLiveFeed } from '@/Queries/StockInfoTab'
import map from 'lodash/map'
import FastImage from 'react-native-fast-image'
import moment from 'moment'
import join from 'lodash/join'
import Share from '@/Utils/share'

export type LawsuitScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.lawsuits>,
  StockInfoStackScreenProps
>

const LawsuitScreen: FC<LawsuitScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const lawsuitFeeds = getLawsuitsLiveFeed()
  return (
    <ScreenBackgrounds screenName={RouteStacks.lawsuits}>
      <Header headerText={t('lawsuits')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
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
        {map(lawsuitFeeds, (lawsuitFeed, idx: number) => {
          let newsItem = lawsuitFeed.newsItem
          let companies = lawsuitFeed.companies
          let tickers = companies.map((company: { ticker: string }) => {
            return company.ticker
          })
          let hasImage = newsItem.imgUrl !== ''
          return (
            <Animated.View key={`Lawsuit-${idx}`} entering={FadeInDown.duration(200).delay(idx * 100)}>
              <Pressable
                onPress={() =>
                  navigation.navigate(RouteStacks.lawsuitsDetail, {
                    news: {
                      id: newsItem.id,
                      title: newsItem.title,
                      link: newsItem.link,
                      imgUrl: newsItem.imgUrl,
                      publishedAt: newsItem.publishedAt,
                      tickers,
                    },
                  })
                }
                style={{
                  flexDirection: 'row',
                  height: 90,
                }}
              >
                {hasImage ? (
                  <View
                    style={{
                      flexBasis: 100,
                      justifyContent: 'center',
                    }}
                  >
                    <SharedElement style={{ width: '100%', height: '90%' }} id={`lawsuitNews.${newsItem?.id}.image`}>
                      <FastImage
                        source={{
                          uri: hasImage ? newsItem?.imgUrl : config.defaultNewsImgUrl,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={hasImage ? 'contain' : 'cover'}
                        style={{
                          backgroundColor: colors.white,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </SharedElement>
                  </View>
                ) : null}
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                    paddingLeft: hasImage ? 10 : 0,
                  }}
                >
                  <SharedElement id={`lawsuitNews.${newsItem.id}.title`}>
                    <Text numberOfLines={2} style={[{ fontSize: 14, color: colors.darkBlueGray, fontWeight: 'bold' }]}>
                      {newsItem.title}
                    </Text>
                  </SharedElement>

                  <Text style={{ color: colors.darkBlueGray, fontSize: 12, fontWeight: 'bold', paddingVertical: 2 }}>
                    {moment(newsItem?.publishedAt).format('YYYY-MM-DD')}
                  </Text>

                  <SharedElement id={`lawsuitNews.${newsItem?.id}.tickers.${join(tickers, '-')}`}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      {map(tickers, (ticker: string, idx: number) => {
                        return (
                          <View
                            key={`ticker-${idx}`}
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
              </Pressable>
            </Animated.View>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default LawsuitScreen
