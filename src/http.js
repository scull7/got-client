/* @flow */

import * as QS from 'querystring'
import { posix as Path } from 'path'
import * as URL from 'url'
import { isNil, propEither } from './lib.js'

export type Query   = { [ key: string ]: any }
export type Headers = { [ key: string ]: string }

export type Body    = Object

export type Method  =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "HEAD"
  | "DELETE"


export type Url =
  { protocol?: string
  , slashes?: boolean
  , auth?: string
  , host?: string
  , port?: string
  , hostname?: string
  , hash?: string
  , search?: string
  , query?: string | Query
  , pathname?: string
  , path?: string
  , href: string
  }



export function Merge(x: ?mixed, y: ?mixed): Object {
  if ( isNil(x) ) x = {}
  if ( isNil(y) ) y = {}

  if (typeof x === 'string') x = QS.parse(x)
  if (typeof y === 'string') y = QS.parse(y)

  if (typeof x !== 'object' || typeof y !== 'object')
    throw new TypeError('Invalid merge parameter.')

  return Object.assign({}, x, y)
}


function PathJoin(x: ?string, y: ?string) : string {

  if (typeof x !== 'string') x = ''
  if (typeof y !== 'string') y = ''

  return Path.join(x, y)
}


export function UrlJoin(x: ?string, y: ?string) : string {
  if ( x === null || x === undefined) x = ''
  if ( y === null || y === undefined) y = ''

  const y_url: Url = URL.parse(y)

  if (y_url.protocol) return y

  const x_url: Url = URL.parse(x)

  const z_url : Object = Object.assign(x_url, {
    hostname: propEither('hostname', x_url, y_url)
  , pathname: PathJoin(x_url.pathname, y_url.pathname)
  , query: Merge(x_url.query, y_url.query)
  , hash: propEither('hash', x_url, y_url)

  // The following properties are nullified because they will
  // override any merge attempts if they have a value.
  , href: undefined
  , path: undefined
  , search: undefined
  })

  return URL.format(z_url)
}
