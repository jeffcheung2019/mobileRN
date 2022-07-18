import Realm from 'realm'
import { PostSchema } from './Schemas/PostSchema'

export const initRealm = async () => {
  const schemaVersion = 1
  const realm = await Realm.open({
    schemaVersion,
    path: 'default.realm',
    schema: [PostSchema],
  })
  return realm
}
