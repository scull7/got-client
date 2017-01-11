
import test from 'ava'
import GotClient from '../../src/main'


const user_config = {
  url: 'http://test.com?buzz=baz'
, headers: { 'Content-Type': 'application/json' }
}


function FakeClientCall({ fake_lib, url, options }) {
  return GotClient(user_config, fake_lib)(url, options)
}

function FakeMethodCall({ fake_lib, method, url, options }) {
  return GotClient(user_config, fake_lib)[method](url, options)
}


test.cb('Client should merge default headers and given headers ' +
'when custom headers are supplied for a call', t => {

  FakeClientCall({
    url: '/foo?blah=bar'
  , options: {
      headers: { 'X-Test' : 'foo-bar' }
    }
  , fake_lib: (url, options) => {

      t.is(url, 'http://test.com/foo?buzz=baz&blah=bar')
      t.is(options.method, 'GET')
      t.deepEqual(options.headers, {
        'Content-Type': 'application/json'
      , 'X-Test': 'foo-bar'
      })
      t.end()

    }
  })

})

test.cb('Client should have the post convenience method', t => {

  FakeMethodCall({
    url: '/is-post'
  , method: 'post'
  , options: {}
  , fake_lib: (url, options) => {

      t.is(url, 'http://test.com/is-post')
      t.is(options.method, 'POST')
      t.end()

    }
  })

})

