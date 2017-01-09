/* @flow */

import type { Config } from './config/client'
import { Factory as ClientConfigFactory } from './config/client'

const client_config : Config = ClientConfigFactory({})
console.log(client_config)
