
import * as babel from 'babel-core'
import { createFilter } from 'rollup-pluginutils'


function BabelTransform(options, filter, code, id) {

  if ( filter(id) ) {
    const result = babel.transform(code, options)

    return {
      code: result.code.toString()
    , map: result.map
    }
  }

}


export default function RollupBabel(options = {}) {
  const filter = createFilter(options.include, options.exclude)

  delete options.include
  delete options.exclude

  return {
    name      : 'babel-transform'
  , transform : BabelTransform.bind(null, options, filter)
  }
}
