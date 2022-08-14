import axios, { AxiosRequestConfig } from 'axios'
import { useRef } from 'react'
import useSWR, { Fetcher, Key, SWRConfiguration, SWRResponse } from 'swr'
import useSWRImmutable from 'swr/immutable'

export const fetchers = {
  get: (url: string) => axios.get(url).then(res => res.data),
  post: (url: string) => axios.post(url).then(res => res.data),
  config: (url: string, config: AxiosRequestConfig) => axios({ ...config }),
}

export type CancelableSWRResult = {
  data: any
  error: any
  abortController: AbortController
}
export const useCancelableSWR = <T, Error>(axiosConfigs: AxiosRequestConfig, opts?: SWRConfiguration<T, Error>): CancelableSWRResult => {
  const abortController = new AbortController()

  console.log('useCancelableSWR')

  let { data, error } = useSWRImmutable(
    [axiosConfigs.url, axiosConfigs],
    (url, axiosConfigs) => axios({ url, signal: abortController.signal, ...axiosConfigs }).then(res => res.data),
    opts && { ...opts },
  )
  return {
    data,
    error,
    abortController,
  }
}
