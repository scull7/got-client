import includePaths from 'rollup-plugin-includepaths'
import RollupBabel from './build-lib/rollup-babel-plugin.js'

const pluginIncludePaths = includePaths({
  paths: [ 'src' ]
, extensions: [ '.js', '.json' ]
})


const pluginBabel = RollupBabel({
  exclude: 'node_modules/**'
, plugins: [ 'transform-flow-strip-types' ]
})


const pkg      = require('./package.json')
const external = Object.keys(pkg.dependencies);

const sourceMap = process.env.NODE_ENV === 'production' ? false : 'inline'


export default {
  entry: 'src/main.js'
, plugins: [
    pluginIncludePaths
  , pluginBabel
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
