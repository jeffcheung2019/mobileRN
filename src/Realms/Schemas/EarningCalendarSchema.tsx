import Realm from 'realm'
import { Schema } from './Schema'
// Declare Schema
export type EarningCalendar = {
  earningDate: [number, number]

  tickerIcon: string
  ticker: string
  tickerName: string
  epsEst: string
  epsReported: string
  revEst: string
  revReported: string
  earningResultTime: string
  marketCap: string
}

export const EarningCalendarSchema: Schema = {
  name: 'Earning',
  properties: {
    _id: 'objectId',
    earningDate: 'number[]', // need to add extra 3 0 behind

    tickerIcon: 'string', //0
    ticker: 'string', // 1
    tickerName: 'string',
    epsEst: 'number',
    epsReported: 'number',
    revEst: 'string', // in billion / million
    revReported: 'string', // in billion / million
    earningResultTime: 'string', // D | N
    marketCap: 'number', // in billion / million
  },
  primaryKey: '_id',
}

export default EarningCalendarSchema
