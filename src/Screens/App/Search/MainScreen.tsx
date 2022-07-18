import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { View, ActivityIndicator, Text, TextInput, ScrollView, TextStyle, Alert, ViewStyle, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorParamList, MainTabNavigatorProps } from '@/Navigators/MainStackNavigator'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import { Header } from '@/Components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { CompositeScreenProps } from '@react-navigation/native'
import { gql, useQuery } from '@apollo/client'
import map from 'lodash/map'
import { StackScreenProps } from '@react-navigation/stack'
import { SearchScreenNavigationProps, SearchScreenNavigatorParamList } from '../SearchScreen'

export type SearchMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<SearchScreenNavigatorParamList, RouteStacks.searchMain>,
  SearchScreenNavigationProps
>

const getTicker = (searchText: string) => {
  const GET_TICKER = gql`
    query CompanySearch(
      $ids: [int64!]
      $first: int64
      $last: int64
      $after: string
      $before: string
      $filterText: string
      $sortBy: string
      $searchTerm: string!
    ) {
      getCompanies(
        ids: $ids
        first: $first
        last: $last
        after: $after
        before: $before
        filterText: $filterText
        sortBy: $sortBy
        searchTerm: $searchTerm
      ) {
        totalCount
        edges {
          node {
            id
            ticker
            name
            exchange
            industry
            sector
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `

  const { loading, error, data } = useQuery(GET_TICKER, {
    variables: { first: 10, filterText: searchText, searchTerm: searchText },
  })

  return {
    data,
  }

  // return useMemo(() => {

  // }, [loading])
}

const SearchMainScreen: FC<SearchMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route!.params || { username: null }

  const [searchText, setSearchText] = useState('')

  const onSearchTextChange = (text: string) => {
    setSearchText(text)
  }

  const data: any = getTicker(searchText)

  let tickers = useMemo(() => {
    return data?.getCompanies?.edges.map((elem: any) => {
      return elem.node
    })
  }, [data, searchText])

  return (
    <ScreenBackgrounds screenName={RouteStacks.setting}>
      <Header
        headerText={t('search')}
        onLeftPress={() => {
          navigation.goBack()
        }}
        leftIcon={() => <MaterialCommunityIcons name='chevron-left' size={22} />}
      />
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter, Gutters.smallHPadding]}>
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            flex: 1,
            alignContent: 'flex-start',
          }}
        >
          <TextInput value={searchText} onChangeText={onSearchTextChange} placeholder={t('searchTicker')} />
        </View>
        <ScrollView style={{}}>
          {map(tickers, (elem, idx) => {
            return (
              <View>
                <Text style={{ width: '100%', fontSize: 14, color: colors.darkBlueGray }}>{elem.name}</Text>
                <Text style={{ width: '100%', fontSize: 14, color: colors.darkBlueGray }}>{elem.ticker}</Text>
              </View>
            )
          })}
        </ScrollView>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SearchMainScreen
