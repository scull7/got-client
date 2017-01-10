/* @flow */

import type { Input, LibraryOptions } from './config.js'
import type { Headers, Query, Method } from './http'

import { InputMergeAll, InputToLibraryOptions } from './config.js'


type GotMethod = (url: string, options: Input) => Promise<Response>


export type Client = {
  (url: string, options: Input): Promise<Response>;
  get    : GotMethod
, post   : GotMethod
, put    : GotMethod
, patch  : GotMethod
, head   : GotMethod
, delete : GotMethod
}


// method configuration factory
function mcf(method: Method): Input {
  return { method: method }
}


function __run(lib: any, url: string, ...i: Array<Input>): Promise<Response> {
  return lib(url, InputToLibraryOptions( InputMergeAll.apply(null, i) ))
}


function methodFactory(lib: any, c: Input, m: Input): GotMethod {

  return function client(url: string, options: Input): Promise<Response> {
    return __run(lib, url, c, m, options)
  }

}


export function Factory(lib: any, c: Input): Client {

  function client(url: string, options: Input): Promise<Response> {

    return __run(lib, url, c, options)

  }
  client.get    = methodFactory(lib, c, mcf("GET"))
  client.post   = methodFactory(lib, c, mcf("POST"))
  client.put    = methodFactory(lib, c, mcf("PUT"))
  client.patch  = methodFactory(lib, c, mcf("PATCH"))
  client.head   = methodFactory(lib, c, mcf("HEAD"))
  client.delete = methodFactory(lib, c, mcf("DELETE"))

  return client
}
