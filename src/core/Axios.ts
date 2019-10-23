import {
  AxiosInstance,
  Axios,
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  RejectedFn,
  ResolvedFn
} from '../types/index'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface InterceptorManagers {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn<T>
}

export default class A implements Axios {
  defaults: AxiosRequestConfig
  interceptors: InterceptorManagers

  constructor(config: AxiosRequestConfig) {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
    this.defaults = config
  }

  getUrl(config: AxiosRequestConfig) {
    config = mergeConfig(this.defaults, config)
    const url = transformURL(config)
    return url
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      config = config || {}
      config.url = url
    } else {
      config = url
    }
    config = mergeConfig(this.defaults, config)
    const chain: Array<PromiseChain<any>> = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'GET',
        url
      })
    )
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'DELETE',
        url
      })
    )
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'HEAD',
        url
      })
    )
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'OPTIONS',
        url
      })
    )
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'POST',
        url,
        data
      })
    )
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'PATCH',
        url,
        data
      })
    )
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: 'PUT',
        url,
        data
      })
    )
  }
}
