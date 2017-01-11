
import * as QS from 'querystring'
import { posix as Path } from 'path'
import * as URL from 'url'

export type Headers = { [ key: string ]: string }

export type Query   = { [ key: string ]: any }

export type Body    = Object

export type Method  =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "HEAD"
  | "DELETE"


export type Url =
  { href: string
  , protocol: ?string
  , slashes: ?boolean
  , host: ?string
  , auth: ?string
  , hostname: ?string
  , port: ?string
  , pathname: ?string
  , search: ?string
  , path: ?string
  , query: ?string | Query
  , hash: ?string
  }


function isNil(x: any): boolean {
  return x === undefined || x === null
}


export function Merge<T>(x: T, y: T): T {
  if (isNil(x)) return y
  if (isNil(y)) return x

  if (typeof x === 'string') x = QS.parse(x)
  if (typeof y === 'string') y = QS.parse(y)

  return Object.assign({}, x, y)
}


function __eitherProp(p: string, x: T, y: T): any {
  return isNil(x[p]) ? y[p] : x[p]
}


function PathJoin(x: ?string, y: ?string) : ?string {
  if ( isNil(x) ) return y
  if ( isNil(y) ) return x

  return Path.join(x, y)
}


export function UrlJoin(x: string, y: string) : string {
  if ( isNil(x) ) return y
  if ( isNil(y) ) return x

  const y_url: Url = URL.parse(y)

  if (y_url.protocol) return y

  const x_url: Url = URL.parse(x)

  const z_url = Object.assign(x_url, {
    hostname: __eitherProp('hostname', y_url, x_url)
  , pathname: PathJoin(x_url.pathname, y_url.pathname)
  , query: Merge(x_url.query, y_url.query)
  , hash: __eitherProp('hash', y_url, x_url)
  
  // The following properties are nullified because they will
  // override any merge attempts if they have a value.
  , href: undefined
  , path: undefined
  , search: undefined
  })

  return URL.format(z_url)
}
