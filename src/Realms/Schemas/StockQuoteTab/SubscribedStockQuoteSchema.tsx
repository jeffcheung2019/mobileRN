import Realm from 'realm'
import { Schema } from '../Schema'
import ObjectId from 'bson-objectid'

// Declare Schema
export type SubscribedStockQuote = {
  tabName: string
  tickers: string[]
}

export const SubscribedStockQuoteSchema: Schema = {
  name: 'SubscribedStockQuote',
  properties: {
    _id: 'objectId',

    tabName: 'string',
    tickers: 'string[]',
  },
  primaryKey: '_id',
}

export default SubscribedStockQuoteSchema
