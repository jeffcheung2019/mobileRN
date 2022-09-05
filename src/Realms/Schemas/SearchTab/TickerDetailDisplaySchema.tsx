import Realm from 'realm'
import { Schema } from './Schema'
import ObjectId from 'bson-objectid'

// Declare Schema
export type TickerDetailDisplay = {
  _id: ObjectId
  ticker: string
  section: number
  subscribed: boolean
}

export type TickerDetailSectionsType = {
  priceTargets: boolean
  insiderTransactions: boolean
  earnings: boolean
  secFilings: boolean
}

export enum TickerDetailSections {
  priceTargets = 0,
  insiderTransactions = 1,
  earnings = 2,
  secFilings = 3,
}

export const tickerDetailSectionsStrMap: string[] = ['priceTargets', 'insiderTransactions', 'earnings', 'secFilings']

// export const sectionNumberMap: {
//   [key in TickerDetailSections]: number
// } = {
//   priceTargets: 0,
//   earnings: 1,
//   insiderTransactions: 2,
//   secFilings: 3,
// }

export const TickerDetailDisplaySchema: Schema = {
  name: 'TickerDetailDisplay',
  properties: {
    _id: 'objectId',

    ticker: 'string',
    section: 'int', // 0 : pt, 1: it, 2: er, 3: sec
    subscribed: 'bool', // default true,
  },
  primaryKey: '_id',
}

export default TickerDetailDisplaySchema
