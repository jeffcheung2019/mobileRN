import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { PriceTarget } from '@/Queries/SearchTab'
import map from 'lodash/map'
import moment from 'moment'

type PriceTargetSectionProps = {
  priceTargets: PriceTarget[] | undefined
}

const PriceTargetSection: FC<PriceTargetSectionProps> = ({ priceTargets }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <>
      {priceTargets === undefined || priceTargets.length === 0 ? (
        <View>
          <Text style={{ color: colors.darkBlueGray, fontSize: 12 }}>{t('noResult')}</Text>
        </View>
      ) : (
        map(priceTargets, (priceTarget: PriceTarget, idx: number) => {
          let ptPrior = priceTarget.ptPrior ? priceTarget.ptPrior / 100 : null
          let pt = priceTarget.pt ? priceTarget.pt / 100 : null
          let { rating, date, analyst, ratingPrior } = priceTarget
          return (
            <Pressable
              key={`PriceTarget-${idx}`}
              style={{
                height: 50,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                // InAppBrowser.open(pt.link)
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}
              >
                <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center' }}>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{t('date')}:</Text>
                    {`  ${moment(date).format('DD-MM-YYYY')}`}
                  </Text>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{t('analyst')}:</Text> {` ${analyst}`}
                  </Text>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{t('priceTargetChange')}:</Text> {ptPrior !== null ? `$${ptPrior}` : ''}{' '}
                    {ptPrior ? '->' : ''} {`$${pt}`}
                  </Text>
                </View>
                <View style={{ flex: 5, alignItems: 'flex-start', justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    {ratingPrior ? (
                      <View style={{ backgroundColor: colors.darkBlueGray, paddingVertical: 4, paddingHorizontal: 6 }}>
                        <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: 9 }}>{ratingPrior}</Text>
                      </View>
                    ) : null}
                    {ratingPrior ? (
                      <View style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
                        {<Text style={{ color: colors.darkBlueGray, fontSize: 9 }}>{'->'}</Text>}
                      </View>
                    ) : null}
                    <View style={{ backgroundColor: colors.darkBlueGray, paddingVertical: 4, paddingHorizontal: 6 }}>
                      <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: 9 }}>{rating}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          )
        })
      )}
    </>
  )
}

export default PriceTargetSection
