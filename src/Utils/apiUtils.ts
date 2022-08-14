import axios, { AxiosRequestConfig } from 'axios'
import moment from 'moment'
import useSWR from 'swr'
import { api } from './constants'
import { useCancelableSWR } from './swrUtils'

export type TradingViewEarningApiResult = {
  d: (number | string)[]
  s: string
}

export const tradingViewEarningApi = (earningDay: number, start: number = 0, end: number = 150) => {
  let startTimestamp: number = 0
  let endTimestamp: number = 0

  startTimestamp = moment()
    .startOf('week')
    .add(12 * (1 + (earningDay + 1) * 2), 'hours')
    .unix()

  endTimestamp = moment()
    .startOf('week')
    .add(12 * (2 + (earningDay + 1) * 2), 'hours')
    .unix()

  var postParam = `{"filter":[{"left":"market_cap_basic","operation":"nempty"},{"left":"is_primary","operation":"equal","right":true},{"left":"earnings_release_date,earnings_release_next_date","operation":"in_range","right":[${startTimestamp},${endTimestamp}]},{"left":"earnings_release_date,earnings_release_next_date","operation":"nequal","right":1660017600}],"options":{"lang":"en"},"markets":["america"],"symbols":{"query":{"types":[]},"tickers":[]},"columns":["logoid","name","market_cap_basic","earnings_per_share_forecast_next_fq","earnings_per_share_fq","eps_surprise_fq","eps_surprise_percent_fq","revenue_forecast_next_fq","revenue_fq","earnings_release_next_date","earnings_release_next_calendar_date","earnings_release_next_time","description","type","subtype","update_mode","earnings_per_share_forecast_fq","revenue_forecast_fq","earnings_release_date","earnings_release_calendar_date","earnings_release_time","currency","fundamental_currency_code"],"sort":{"sortBy":"market_cap_basic","sortOrder":"desc"},"range":[0,150]}`

  var axiosConfig: AxiosRequestConfig = {
    method: 'post',
    url: api.earning,
    headers: {
      'Content-Type': 'text/plain',
    },
    data: postParam,
  }

  return axiosConfig
}
