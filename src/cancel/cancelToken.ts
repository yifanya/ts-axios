import { CancelExecutor, CancelTokenSource, Canceler, CancelToken } from '../types'
import Cancel from './Cancel'

interface IResolvePromise {
  (value?: Cancel): void
}

class C implements CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(exector: CancelExecutor) {
    let ResolvePromise: IResolvePromise

    this.promise = new Promise<Cancel>(resolve => {
      ResolvePromise = resolve
    })

    exector((message?: string) => {
      if (this.reason) return
      this.reason = new Cancel(message)
      ResolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new C(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}

export default C
