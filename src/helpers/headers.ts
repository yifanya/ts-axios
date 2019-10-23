import { isPlainObject, deepMerge } from './util'
import { Methods } from '../types'

function normalizeHeaders(headers: any, normalizedName: string) {
  if (!headers) return

  Object.keys(headers).forEach(name => {
    if (normalizedName !== name && normalizedName.toUpperCase() === name.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaders(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeader(headers: string): any {
  let parsed = Object.create(null)

  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [key, ...values] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    let value = values.join(':').trim()
    if (value) {
      value = value.trim()
    } else {
      value = ''
    }
    parsed[key] = value
  })
  return parsed
}

export function plattenHeaders(headers: any, method: Methods): any {
  if (!headers) return headers
  headers = deepMerge(headers.common, headers[method], headers)
  const methodToDelete = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options', 'common']
  methodToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
