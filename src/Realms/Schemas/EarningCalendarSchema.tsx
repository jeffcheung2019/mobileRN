import Realm from 'realm'
import { Schema } from './Schema'
// Declare Schema
export type EarningCalendar = {
  earningDate: [number, number]

  tickerIcon: string
  ticker: string
  tickerName: string
  epsEst: number
  epsReported: number
  revEst: string
  revReported: string
  earningResultTime: string
  marketCap: number
}

export const EarningCalendarSchema: Schema = {
  name: 'EarningCalendar',
  properties: {
    _id: 'objectId',
    earningDate: 'int[]', // need to add extra 3 right padded 0

    tickerIcon: 'string', //0
    ticker: 'string', // 1
    tickerName: 'string',
    epsEst: 'float',
    epsReported: 'float',
    revEst: 'string', // in billion / million
    revReported: 'string', // in billion / million
    earningResultTime: 'string', // D | N
    marketCap: 'float', // in billion / million
  },
  primaryKey: '_id',
}

export default EarningCalendarSchema
