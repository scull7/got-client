/* @flow */
import type { Headers } from '../http'
import type { Query } from '../url'

type Auth =
  { user     : string
  , password : string
  }

type Timeout =
  { connection : ?number
  , socket     : ?number
  }


type RetryFn           = (retry: number, error: any) => number
type Retry             = number | RetryFn


export type Config =
  { base_url?       : string
  , auth?           : Auth
  , is_json?        : boolean
  , timeout?        : Timeout
  , retry?          : Retry
  , encoding?       : string
  , headers?        : Headers
  , query?          : Query
  , followRedirect? : boolean
  }


export function authToString(a: Auth): string {
  return a.user + ':' + a.password
}


export function propOr<T>(p: string, d: T, u: Config): T {
  return u[p] == null ? d : u[p]
}
