import { createContext, useContext } from 'react'

export const RealmContext = createContext<Realm | undefined>(undefined)

export const useRealm = () => {
  return useContext(RealmContext)
}
