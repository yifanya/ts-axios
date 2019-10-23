import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { plattenHeaders } from '../helpers/headers'
import xhr from './xhr'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = plattenHeaders(config.headers, config.method!)
  config.data = transformRequestData(config)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { params, url, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }

  return buildURL(url!, params, paramsSerializer)
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transform(data, config.headers, config.transformRequest)
}
function transformResponseData(res: AxiosResponse): any {
  if (res.request.responseType === 'text') {
    return res
  }
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
