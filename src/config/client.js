/* @flow */

import type { Headers } from '../http'
import type { Query } from '../url'
import type { Config as UserConfig } from './user'
import * as User from './user'

type Path    = string
type RetryFn = (retry: number, any) => number
type Retry   = number | RetryFn
type Timeout = {
  connection : number
, socket     : number
}


const DEFAULT_OPTION_BASE_URL : string  = '/'
const DEFAULT_OPTION_JSON     : boolean = true
const DEFAULT_OPTION_RETRY    : number  = 0
const DEFAULT_OPTION_REDIRECT : boolean = true
const DEFAULT_OPTION_ENCODING : string  = 'utf8'
const DEFAULT_OPTION_HEADERS  : Headers = {}
const DEFAULT_OPTION_QUERY    : Query   = {}
const DEFAULT_OPTION_TIMEOUT  : Timeout = {
  connection : 120000 // 2 minutes
, socket     : 30000 // 30 seconds
}


function getAuth(u: UserConfig): string {
  return u.auth == null ? '' : User.authToString(u.auth)
}


function timeoutPropOr(p: string, d: number, u: UserConfig): number {
  return u.timeout == null ? d : (u.timeout[p] == null ? d : u.timeout[p])
}


function getTimeout(u: UserConfig): Timeout {
  const CONNECTION = DEFAULT_OPTION_TIMEOUT.connection
  const SOCKET = DEFAULT_OPTION_TIMEOUT.socket
  
  return {
    connection: timeoutPropOr('connection', CONNECTION, u)
  , socket: timeoutPropOr('socket', SOCKET, u)
  }
}


export type Config = {
  base_url       : string
, auth           : string
, json           : boolean
, timeout        : Timeout
, retry          : Retry
, encoding       : string
, headers        : Headers
, followRedirect : boolean
}


export function Factory(u: UserConfig) : Config {

  return {
    base_url       : User.propOr('base_url', DEFAULT_OPTION_BASE_URL, u)
  , auth           : getAuth(u)
  , json           : User.propOr('is_json', DEFAULT_OPTION_JSON, u)
  , timeout        : getTimeout(u)
  , retry          : User.propOr('retry', DEFAULT_OPTION_RETRY, u)
  , encoding       : User.propOr('encoding', DEFAULT_OPTION_ENCODING, u)
  , headers        : User.propOr('headers', DEFAULT_OPTION_HEADERS, u)
  , query          : User.propOr('query', DEFAULT_OPTION_HEADERS, u)
  , followRedirect : User.propOr('followRedirect', DEFAULT_OPTION_REDIRECT, u)
  }

}
