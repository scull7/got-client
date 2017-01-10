
import test from 'ava'
import GotClient from '../../src/main'

test.cb('Client should merge default headers and given headers ' +
'when custom headers are supplied for a call', t => {

  const user_config = {
    headers: { 'Content-Type': 'application/json' }
  }

  const fake_lib = (url, options) => {
    t.is(url, 'http://test.com')
    t.is(options.method, 'GET')
    t.deepEqual(options.headers, {
      'Content-Type': 'application/json'
    , 'X-Test': 'foo-bar'
    })
    t.end()
  }
  console.log('GOT CLIENT: ', GotClient)
  const client = GotClient(user_config, fake_lib)
  console.log('CLIENT: ', client)

  client('http://test.com', {
    headers: { 'X-Test': 'foo-bar' }
  })

})

