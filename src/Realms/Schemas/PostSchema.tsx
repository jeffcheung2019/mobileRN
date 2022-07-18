import Realm from 'realm'
import { Schema } from './Schema'
// Declare Schema
export type Post = {
  title: string
  createdBy: string
}

export const PostSchema: Schema = {
  name: 'Post',
  properties: {
    _id: 'objectId',
    title: 'string',
    createdBy: 'string',
  },
  primaryKey: '_id',
}

export default PostSchema
