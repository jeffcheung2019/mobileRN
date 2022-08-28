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

type InsiderTransaction = NewsItem & {
  action: string
  unitsSold: RegExpMatchArray | null
  unitsBought: RegExpMatchArray | null
  unitsWorth: string
  unitsOptionsCoverted: RegExpMatchArray | null
}

const INSIDER_TRANSACTION_CELL_TEXT: TextStyle = {
  color: colors.darkBlueGray,
  textAlign: 'left',
  fontSize: 10,
}

type InsiderTransactionSectionProps = {
  companyId: number
}

const InsiderTransactionSection: FC<InsiderTransactionSectionProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const rawInsiderTransactions: NewsItem[] | undefined = getNewsItemPanel(
    [companyId],
    queryConstants.getNewsItemPanel.insiderTransactions.sourceIds,
    queryConstants.getNewsItemPanel.insiderTransactions.categoryIds,
    40,
  )

  const insiderTransactions: InsiderTransaction[] | [] = useMemo(() => {
    let res: InsiderTransaction[] | undefined = []
    if (rawInsiderTransactions === undefined) return res
    for (let i = 0; i < rawInsiderTransactions.length; i++) {
      let title = rawInsiderTransactions[i]?.title
      let isBuy = title?.match(/bought [$0-9,.]+ worth of shares/g)
      let isSell = title?.match(/sold [$0-9,.]+ worth of shares/g)
      let shareUnits = title?.match(/[0-9.,]+(?= units at)/g)
      let unitsWorth = title?.match(/[0-9,]+(?= worth of shares)/g) ?? []
      let isOptionExercised = title?.match(/exercised/g)
      let unitsOptionsCoverted = title?.match(/[0-9,]+ (?=shares)/g)

      let action: string = ''
      if (isSell) {
        action = 'Sale'
      } else if (isBuy) {
        action = 'Buy'
      } else if (isOptionExercised) {
        action = 'Option'
      } else {
        action = ''
      }
      if (['Sale', 'Buy', 'Option'].includes(action)) {
        res.push({
          ...rawInsiderTransactions[i],
          action,
          unitsSold: isSell ? shareUnits : null,
          unitsBought: isBuy ? shareUnits : null,
          unitsWorth: unitsWorth[0] ?? '0',
          unitsOptionsCoverted,
        })
      }
    }

    return res
  }, [rawInsiderTransactions])

  return (
    <>
      {insiderTransactions.length === 0 ? (
        <View>
          <Text style={{ color: colors.darkBlueGray, fontSize: 12 }}>{t('noResult')}</Text>
        </View>
      ) : (
        map(insiderTransactions, (transaction, idx: number) => {
          const { unitsSold, unitsBought, unitsOptionsCoverted, unitsWorth, action, publishedAt, link } = transaction

          return action === '' ? null : (
            <Pressable
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 4,
              }}
              key={`InsiderTransaction-${idx}`}
              onPress={() => InAppBrowser.open(link)}
            >
              {
                <>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text style={[INSIDER_TRANSACTION_CELL_TEXT]}>
                      <Text style={{ fontWeight: 'bold' }}>{t('date')}:</Text>
                      {moment(publishedAt).format('DD-MM-YYYY')}
                    </Text>
                    <Text style={[INSIDER_TRANSACTION_CELL_TEXT, {}]}>
                      <Text style={{ fontWeight: 'bold' }}>{t('shares')}:</Text>
                      {action === 'Sale' ? unitsSold : action === 'Buy' ? unitsBought : action === 'Option' ? unitsOptionsCoverted : ''}
                    </Text>
                    <Text style={[INSIDER_TRANSACTION_CELL_TEXT]}>
                      <Text style={{ fontWeight: 'bold' }}>{t('value')}:</Text>
                      {moneyConvertToKMB(Number(unitsWorth.replace(/,/g, '')))}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexBasis: 120,
                      alignItems: 'center',
                      width: '70%',
                      backgroundColor: colors.darkBlueGray,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.white,
                        fontWeight: 'bold',
                        fontSize: 10,
                      }}
                    >
                      {action}
                    </Text>
                  </View>
                </>
              }
            </Pressable>
          )
        })
      )}
    </>
  )
}

export default InsiderTransactionSection
