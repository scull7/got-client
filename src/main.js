/* @flow */

import type { Input } from './config.js'
import type { Client } from './client.js'

import * as got from "got"
import { Factory as ClientFactory } from './client'


// Marking lib as any so that we can make testing a bit easier. This
// allows us to just send in any object and hope that it supplies
// the proper interface.  Since we're just using `got` in the
// default (and probably only) case this should be fine.
export default function GotClient(u: Input, lib: any): Client {

  return ClientFactory( lib || got, u)

}
