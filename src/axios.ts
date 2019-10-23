import { AxiosRequestConfig, AxiosStatic } from './types/index'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import mergeConfig from './core/mergeConfig'
import defaultConfig from './defaults'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

// type s = typeof Cancel;

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}
const axios = createInstance(defaultConfig)
axios.create = function(config?: AxiosRequestConfig) {
  config = config || {}
  return createInstance(mergeConfig(defaultConfig, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = function spread(callback) {
  return function(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios

export default axios
