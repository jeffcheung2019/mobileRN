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

type EarningResult = {
  earningDate: string
  quarterYearDate: string
  pmAm: string
}

type EarningSectionProps = {
  companyId: number
}

let quarterNumMap: { [key: string]: number } = {
  First: 1,
  Second: 2,
  Third: 3,
  Fourth: 4,
}

const EarningSection: FC<EarningSectionProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const rawEarningResult: NewsItem[] | undefined = getNewsItemPanel(
    [companyId],
    queryConstants.getNewsItemPanel.earningResult.sourceIds,
    queryConstants.getNewsItemPanel.earningResult.categoryIds,
    20,
  )

  const earningResult: EarningResult[] = useMemo(() => {
    let res: EarningResult[] = []
    if (rawEarningResult) {
      for (let i = rawEarningResult.length - 1; i >= 0; i--) {
        let elem = rawEarningResult[i]
        let elemTitle = elem?.title
        let elemSummary = elem?.summary
        let isEarningDateAnnouncement = elemTitle?.match(/to Report/g)
        let isPerliminaryRes = elemTitle?.match(/Preliminary Unaudited/g)
        let eanringYear = elemTitle?.match(/[0-9]+ (?=Earnings on)/g)
        let earningDate = elemTitle?.match(/[a-zA-Z]+ [0-9]+, [0-9]+/g)
        let earningQuarter = elemTitle?.match(/First|Second|Third|Fourth/g)
        let earningReleaseMarketTime = elemSummary?.match(/before|after the market open|close/g)
        let earnignPTET = elemSummary?.match(/[0-9]+:[0-9]+ a.m.|p.m. PT \/ [0-9]+:[0-9]+ a.m|p.m. ET/g)

        if (isPerliminaryRes && earningReleaseMarketTime) {
          let pmAm = earningReleaseMarketTime[0] === 'before the market open' ? 'PM' : 'AM'
          let quarter = elemTitle?.match(/Q[0-4]/g)
          eanringYear = elemTitle?.match(/[0-4]+ (?=Financial Results)/g)
          earningDate = elemSummary?.match(/[a-zA-Z]+ [0-9]+, [0-9]+/g)

          if (quarter && earningDate && eanringYear) {
            res.push({
              earningDate: `${earningDate[0]}`,
              pmAm,
              quarterYearDate: `${quarter[0]} 20${eanringYear[0]}`,
            })
          }
        } else if (isEarningDateAnnouncement && eanringYear && earningDate && earningReleaseMarketTime) {
          let pmAm = earningReleaseMarketTime[0] === 'before the market open' ? 'PM' : 'AM'
          if (earningQuarter && ['First', 'Second', 'Third', 'Fourth'].includes(earningQuarter[0])) {
            res.push({
              earningDate: `${earningDate[0]}`,
              pmAm,
              quarterYearDate: `Q${quarterNumMap[earningQuarter[0]]} ${eanringYear[0]}`,
            })
          }
        }
      }
    }
    return res
  }, [rawEarningResult])

  return (
    <>
      {earningResult.length === 0 ? (
        <View>
          <Text style={{ color: colors.darkBlueGray, fontSize: 12 }}>{t('noResult')}</Text>
        </View>
      ) : (
        map(earningResult, (earning, idx) => {
          return (
            <View
              key={`EarningResult-${idx}`}
              style={{
                // height: 50,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginVertical: 4,
              }}
            >
              <View style={{ flexBasis: 160, alignItems: 'flex-start' }}>
                <Text style={{ color: colors.darkBlueGray, fontSize: 10, textAlign: 'left' }}>
                  <Text style={{ fontWeight: 'bold' }}>{t('quarter')}:</Text>
                  {earning.quarterYearDate}
                </Text>
                <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>{t('date')}:</Text>{' '}
                  {moment(earning.earningDate, 'MMMM DD, YYYY').format('DD-MM-YYYY')}
                </Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    color: colors.white,
                    backgroundColor: colors.darkBlueGray,
                    width: 36,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {earning.pmAm}
                </Text>
              </View>
            </View>
          )
        })
      )}
    </>
  )
}

export default EarningSection
