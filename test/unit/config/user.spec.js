
import test from 'ava'
import * as User from '../../../src/config/user'

function title(method, subtext) {
  return `Config::User::${method} - ${subtext}`
}


test( title('propOr', 'should return a default'),
t => {

  const config   = {}
  const expected = 'my-url'
  const actual   = User.propOr('base_url', expected, config)

  t.is(actual, expected)

  
})
