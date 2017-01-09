/* @flow */

import type { Config } from './config/client'
import type { Config as UserConfig } from './config/user'
import type { Client } from './client'

import * as got from "got"
import { Factory as ClientConfigFactory } from './config/client'
import { Factory as ClientFactory } from './client'


// Marking lib as any so that we can make testing a bit easier. This
// allows us to just send in any object and hope that it supplies
// the proper interface.  Since we're just using `got` in the
// default (and probably only) case this should be fine.
export default function GotClient(u: UserConfig, lib: any) : Client {

  return ClientFactory( lib || got, ClientConfigFactory(u) )

}
