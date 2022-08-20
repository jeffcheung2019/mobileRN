import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { getNewsItemPanel, NewsItem, PriceTarget } from '@/Queries/SearchTab'
import map from 'lodash/map'
import moment from 'moment'
import { moneyConvertToKMB } from '@/Utils/helpers'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { queryConstants } from '@/Queries/Constants'

type SecFilingSectionProps = {
  companyId: number
}

const SecFilingSection: FC<SecFilingSectionProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const secFilings: NewsItem[] | undefined = getNewsItemPanel(
    [companyId],
    queryConstants.getNewsItemPanel.secFiling.sourceIds,
    queryConstants.getNewsItemPanel.secFiling.categoryIds,
    5,
  )

  return (
    <>
      {secFilings === undefined || secFilings.length === 0 ? (
        <View>
          <Text style={{ color: colors.darkBlueGray, fontSize: 12 }}>{t('noResult')}</Text>
        </View>
      ) : (
        map(secFilings, (sec, idx: number) => {
          return (
            <Pressable
              style={{
                height: 60,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              key={`SecFiling-${idx}`}
              onPress={() => InAppBrowser.open(sec.link)}
            >
              {
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 4, justifyContent: 'center' }}>
                    <View style={{}}>
                      <Text numberOfLines={1} style={{ color: colors.darkBlueGray, fontSize: 12, fontWeight: 'bold' }}>
                        {sec.title}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text numberOfLines={2} style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                        {sec.summary}
                      </Text>
                    </View>
                  </View>
                </View>
              }
            </Pressable>
          )
        })
      )}
    </>
  )
}

export default SecFilingSection
