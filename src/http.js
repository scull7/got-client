
import querystring as QS from 'querystring'
import { posix as Path } from 'path'

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


export function Merge<T>(x: T, y: T): T {
  if (x === undefined) return y;
  if (y === undefined) return x;

  if (typeof x === 'string') x = QS.parse(x)
  if (typeof y === 'string') y = QS.parse(y)

  return Object.assign({}, x, y)
}


export function UrlJoin(x: string, y: string) : string {
  if (x === undefined) return y;
  if (y === undefined) return x;

  return Path.join(x, y)
}
