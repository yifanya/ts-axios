import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformResponse, transformRequest } from './helpers/data'

const defaultConfig: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ],
  validateStatus(status: number) {
    return status >= 200 && status <= 300
  }
}

const methodNoData = ['get', 'head', 'delete', 'options']
const methodWithData = ['post', 'put', 'patch']

methodNoData.forEach(method => {
  defaultConfig.headers[method] = {}
})
methodWithData.forEach(method => {
  defaultConfig.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaultConfig
