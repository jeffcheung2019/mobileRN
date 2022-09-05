import Realm from 'realm'
import { Schema } from '../Schema'
import ObjectId from 'bson-objectid'

// Declare Schema
export type InvestorHoldingDetail = {
  slug: string
}

export const InvestorHoldingDetailSchema: Schema = {
  name: 'InvestorHoldingDetail',
  properties: {
    _id: 'objectId',

    slug: 'string',
  },
  primaryKey: '_id',
}

export default InvestorHoldingDetailSchema
