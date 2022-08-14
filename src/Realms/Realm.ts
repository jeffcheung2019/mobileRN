import Realm from 'realm'
import { PostSchema } from './Schemas/PostSchema'
import { EarningCalendarSchema } from './Schemas/EarningCalendarSchema'

export const initRealm = async () => {
  const schemaVersion = 1
  const realm = await Realm.open({
    schemaVersion,
    path: 'default.realm',
    schema: [PostSchema, EarningCalendarSchema],
  })
  return realm
}
