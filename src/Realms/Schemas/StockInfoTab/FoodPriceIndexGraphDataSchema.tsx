import Realm from 'realm'
import { Schema } from '../Schema'
import ObjectId from 'bson-objectid'

// Declare Schema
export type FoodPriceIndexGraphData = {
  slug: string
}

export const FoodPriceIndexGraphDataSchema: Schema = {
  name: 'FoodPriceIndexGraphData',
  properties: {
    _id: 'objectId',

    timestamp: 'int', //need right pad three 0
    value: 'float',
  },
  primaryKey: '_id',
}

export default FoodPriceIndexGraphDataSchema
