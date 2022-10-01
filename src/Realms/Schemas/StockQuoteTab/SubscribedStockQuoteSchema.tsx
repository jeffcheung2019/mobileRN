import Realm from 'realm'
import { Schema } from '../Schema'
import ObjectId from 'bson-objectid'

export type StockTickerQuoteDetail = {
  id: number
  ticker: string
}

export const StockTickerQuoteDetailSchema = {
  name: 'StockTickerDetail',
  primaryKey: 'id',
  properties: {
    id: 'int',
    ticker: 'string',
  },
}

// Declare Schema
export type SubscribedStockQuote = {
  tabName: string
  stockTickerDetails: StockTickerQuoteDetail[]
}

export const SubscribedStockQuoteSchema: Schema = {
  name: 'SubscribedStockQuote',
  properties: {
    _id: 'objectId',

    tabName: 'string',
    stockTickerDetails: 'StockTickerDetail[]',
  },
  primaryKey: '_id',
}
