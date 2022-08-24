import Realm from 'realm'
import { Schema } from './Schema'
import ObjectId from 'bson-objectid'

// Declare Schema
export type StockQuoteTab = {
  tabName: string
  tickers: string[]
}

export const StockQuoteTabSchema: Schema = {
  name: 'StockQuoteTab',
  properties: {
    _id: 'objectId',

    tabName: 'string',
    tickers: 'string[]',
  },
  primaryKey: '_id',
}

export default StockQuoteTabSchema
