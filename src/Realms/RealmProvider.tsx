import React, { useEffect } from 'react'
import { useState } from 'react'
import { initRealm } from './Realm'
import { RealmContext } from './RealmContext'

type RealmProviderProps = {
  children: React.ReactNode
}

const RealmProvider = ({ children }: RealmProviderProps) => {
  const [realm, setRealm] = useState<Realm>()

  useEffect(() => {
    const run = async () => {
      let newRealm = await initRealm()
      setRealm(newRealm)
    }
    run()

    return () => {
      if (!realm?.isClosed) {
        realm?.close()
      }
    }
  }, [])

  return <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
}

export default RealmProvider
