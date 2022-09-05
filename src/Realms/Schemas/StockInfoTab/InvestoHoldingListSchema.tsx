import Realm from 'realm'
import { Schema } from '../Schema'
import ObjectId from 'bson-objectid'

// Declare Schema
export type InvestorHoldingListItem = {
  companyName: string
  slug: string
  profolioManager: string
}

export const InvestorHoldingListItemSchema: Schema = {
  name: 'InvestorHoldingListItem',
  properties: {
    _id: 'objectId',

    companyName: 'string',
    slug: 'string',
    profolioManager: 'string',
  },
  primaryKey: '_id',
}

export default InvestorHoldingListItemSchema
