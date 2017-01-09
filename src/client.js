/* @flow */

import type { Headers } from './http'
import type { Query } from './url'
import type { Config } from './config/client'


type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "HEAD"
  | "DELETE"

type MethodConfig =
  { method: Method
  }


type Timeout =
  { connection : number
  , socket     : number
  }


type RetryFn = (retry: number, error: Object) => number
type Retry   = number | RetryFn
  

type GotOptions =
  { auth?           : string
  , method          : Method
  , headers?        : Headers
  , timeout?        : number | Timeout
  , body?           : Object
  , encoding?       : string
  , json?           : boolean
  , query?          : string | Query
  , retries?        : Retry
  , followRedirect? : boolean
  }


type Options =
  { headers? : Headers
  , auth? : string
  }


type GotMethod = (url: string, options: Options) => Promise<Response>

export type Client =
  { get    : GotMethod
  , post   : GotMethod
  , put    : GotMethod
  , patch  : GotMethod
  , head   : GotMethod
  , delete : GotMethod
  }


type ExportMethod =
  { name: string
  , method: Method
  }

// These are the methods that will be exported out to 
// the user space.
const EXPORT_METHODS : Array<ExportMethod> = [
  { name: 'get'    , method: "GET" }
, { name: 'post'   , method: "POST" }
, { name: 'put'    , method: "PUT" }
, { name: 'patch'  , method: "PATCH" }
, { name: 'head'   , method: "HEAD" }
, { name: 'delete' , method: "DELETE" }
]

const DEFAULT_GOT_OPTIONS : GotOptions = {
  auth           : undefined
, method         : "GET"
, headers        : undefined
, timeout        : undefined
, body           : undefined
, encoding       : undefined
, json           : undefined
, query          : undefined
, retries        : undefined
, followRedirect : undefined
}

const AbstractClient = {
  get    : undefined
, post   : undefined
, put    : undefined
, patch  : undefined
, head   : undefined
, delete : undefined
}


// Merge together the current config and method config to create the
// base method options which will be passed to the `got` library.
function generateGotOptions(c: Config, m: MethodConfig): GotOptions {
  let options     = DEFAULT_GOT_OPTIONS
  const overrides = [ c, m ]

  for (let i = 0; i < overrides.length; i++) {

    for (let p in overrides[i])
      if (options.hasOwnProperty(p)) options[p] = overrides[i][p]

  }

  return options
}


function __methodBuilder(lib: any, got_opts: GotOptions): GotMethod {
  
  return function(url: string, options: Options): Promise<Response> {

    let call_opts = Object.assign({}, got_opts)
    
    for(let p in call_opts)
      if (options.hasOwnProperty(p)) call_opts[p] = options[p]

    return lib(url, call_opts)

  }
}


function methodFactory(lib: any, c: Config, m: MethodConfig): GotMethod {

  return __methodBuilder(lib, generateGotOptions(c, m))

}


export function Factory(lib: any, c: Config): Client {

  let client = Object.assign({}, AbstractClient)

  for (let i = 0; i < EXPORT_METHODS.length; i++) {
    let { name, method } = EXPORT_METHODS[i]

    if (client.hasOwnProperty(name)) {
      client[name] = methodFactory(lib, c, { method: method })
    }
  }

  return client
  
}
