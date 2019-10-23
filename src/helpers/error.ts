import { AxiosRequestConfig, AxiosResponse } from '../types/index'

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  request: XMLHttpRequest
  code?: string | null
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    request: XMLHttpRequest,
    code?: string | null,
    response?: AxiosResponse
  ) {
    super(message)
    this.config = config
    this.request = request
    this.code = code
    this.response = response
    this.isAxiosError = true

    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  request: XMLHttpRequest,
  code?: string | null,
  response?: AxiosResponse
) {
  return new AxiosError(message, config, request, code, response)
}
