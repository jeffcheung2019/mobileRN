import { GraphPoint } from '@/Types/Graph'
import { api, config } from '@/Utils/constants'
import { fetchers } from '@/Utils/swrUtils'
import { useMemo } from 'react'
import useSWR from 'swr'

export const useFinanceGraph = (
  ticker: string,
): {
  chartData: GraphPoint[]
  currClose: number
  prevClose: number
  lowest: number
  highest: number
} => {
  const { data, error } = useSWR(api.tickerUri(ticker), fetchers.get)
  let currClose = 0
  let prevClose = 0
  let resData: GraphPoint[] = []
  let lowest = 999999
  let highest = -999999
  if (error === undefined && data !== undefined) {
    let res: any = data?.spark?.result[0]
    let timestamp = res?.response[0]?.timestamp ?? []
    let close = res?.response[0]?.indicators?.quote[0]?.close
    currClose = res?.response[0]?.meta?.regularMarketPrice
    prevClose = res?.response[0]?.meta?.previousClose

    for (let i = 0; i < timestamp.length; i++) {
      if (close[i] < lowest) {
        lowest = close[i]
      }
      if (close[i] > highest) {
        highest = close[i]
      }

      resData.push({
        date: new Date(Number(`${timestamp[i]}000`)),
        value: close[i],
      })
    }
  }
  return {
    chartData: resData,
    currClose,
    prevClose,
    lowest: lowest === 999999 ? 0 : lowest,
    highest: highest === -999999 ? 0 : highest,
  }
}
