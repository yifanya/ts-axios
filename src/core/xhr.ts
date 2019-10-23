import { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from '../types/index'
import { parseHeader } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import Cookie from '../helpers/cookie'

export default function(config: AxiosRequestConfig): AxiosPromise {
  const {
    url,
    method = 'GET',
    data = null,
    headers = {},
    responseType,
    timeout,
    cancelToken,
    withCredential,
    xsrfHeaderName,
    xsrfCookieName,
    onDownloadProgress,
    onUploadProgress,
    auth,
    validateStatus
  } = config
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method.toUpperCase(), url!, true)
    if (timeout) {
      xhr.timeout = timeout
    }
    if (responseType) {
      xhr.responseType = responseType
    }
    if (withCredential) {
      xhr.withCredentials = withCredential
    }
    if ((withCredential || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = Cookie.read(xsrfCookieName)
      if (xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue
      }
    }
    if (isFormData(data)) {
      delete headers['Content-Type']
    }
    if (auth) {
      headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
    }
    Object.keys(headers).forEach(header => {
      if (data === null && header.toLowerCase() === 'content-type') {
        delete headers[header]
      } else {
        xhr.setRequestHeader(header, headers[header])
      }
    })
    if (onDownloadProgress) {
      xhr.onprogress = onDownloadProgress
    }
    if (onUploadProgress) {
      xhr.upload.onprogress = onUploadProgress
    }
    if (cancelToken) {
      cancelToken.promise
        .then(reason => {
          xhr.abort()
          reject(reason)
        })
        .catch(() => {
          // do nothing
        })
    }
    xhr.send(data)

    xhr.onreadystatechange = function() {
      if (xhr.status === 0) return
      if (xhr.readyState !== 4) return
      const responseHeaders = xhr.getAllResponseHeaders()
      const responseData = xhr.responseType === 'text' ? xhr.responseText : xhr.response

      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        config,
        request: xhr,
        headers: parseHeader(responseHeaders),
        statusText: xhr.statusText
      }
      handleResponse(response)
    }
    xhr.onerror = function() {
      reject(createError('Network Error', config, xhr, null))
    }
    xhr.ontimeout = function() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, xhr, 'ECOONABORTED'))
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(`Network Error status is ${response.status}`, config, xhr, null, response)
        )
      }
    }
  })
}
