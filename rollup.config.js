import includePaths from 'rollup-plugin-includepaths'
import flow from 'rollup-plugin-flow'

const pluginIncludePaths = includePaths({
  paths: [ 'src' ]
, extensions: [ '.js', '.json' ]
})

const pluginFlow = flow({ pretty: true })

const pkg      = require('./package.json')
const external = Object.keys(pkg.dependencies);

const sourceMap = process.env.NODE_ENV === 'production' ? false : 'inline'


export default {
  entry: 'src/main.js'
, plugins: [
    pluginIncludePaths
  , pluginFlow
  ]
, external: external
, targets: [

    { dest: pkg['main']
    , format: 'cjs'
    , moduleName: 'GotHttpClient'
    , sourceMap
    }
  
  , { dest: pkg['jsnext:main']
    , format: 'es'
    , sourceMap
    }
  ]
}
