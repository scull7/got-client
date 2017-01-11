/* @flow */

import type { Headers, Query, Body, Method } from './http'

import { Merge, UrlJoin } from './http'
import { isNil, propEither } from './lib.js'


export type Auth =
  { user     : string
  , password : string
  }


export type Timeout =
  { connection : ?number
  , socket     : ?number
  }

export type TimeoutOpt = number | Timeout


export type Retry = (retry: number, error: any) => number


export type Input =
  { url?            : string
  , method?         : Method
  , auth?           : Auth
  , is_json?        : boolean
  , timeout?        : ?TimeoutOpt
  , retries?        : number | Retry
  , encoding?       : string
  , headers?        : Headers
  , query?          : string | Query
  , body?           : Body
  , followRedirect? : boolean
  }


export type LibraryOptions =
  { url?            : string
  , method          : Method
  , headers?        : Headers
  , query?          : string | Query
  , body?           : Body
  , auth?           : string
  , is_json?        : boolean
  , encoding?       : string
  , timeout?        : ?TimeoutOpt
  , retries?        : number | Retry
  , followRedirect? : boolean
  }


const DEFAULT_INPUT = {
  url: undefined
, method: "GET"
, headers: {}
, query: {}
, body: {}
, auth: undefined
, is_json: false
, encoding: "utf8"
, timeout: undefined
, retries: undefined
, followRedirect: undefined
}


export function AuthToString(a: Auth): string {
  return `${a.user}:${a.password}`
}


export function InputToLibraryOptions(i: Input): LibraryOptions {

  return {
    url            : i.url
  , method         : i.method || "GET"
  , headers        : i.headers
  , query          : i.query
  , body           : i.body
  , auth           : i.auth ? AuthToString(i.auth) : undefined
  , is_json        : i.is_json
  , encoding       : i.encoding
  , timeout        : i.timeout
  , retries        : i.retries
  , followRedirect : i.followRedirect
  }

}


function __mergeTimeoutOpt(x: ?TimeoutOpt, y: ?TimeoutOpt) : ?TimeoutOpt {
  if (x === undefined) return y;
  if (y === undefined) return x;

  if (typeof x === 'object' && typeof y === 'object')
    return Object.assign({}, x, y)

  return y
}


export function InputMerge(x: Input, y: Input): Input {

  return {
    url: UrlJoin(x.url, y.url)
  , method: propEither('method', x, y)
  , headers: Object.assign({}, x.headers, y.headers)
  , query: Merge(x.query, y.query)
  , body: Merge(x.body, y.body)
  , auth: propEither('auth', x, y)
  , is_json: propEither('is_json', x, y)
  , encoding: propEither('encoding', x, y)
  , timeout: __mergeTimeoutOpt(x.timeout, y.timeout)
  , retries: propEither('retries', x, y)
  , followRedirect: propEither('followRedirect', x, y)
  }
}


function __InputReducer(x: Input, y: Input): Input {
  return InputMerge(x, y)
}


export function InputMergeAll(...args: Array<Input>): Input {
  return args.reduce(__InputReducer, DEFAULT_INPUT)
}
