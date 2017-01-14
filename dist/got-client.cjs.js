'use strict';

var got = require('got');
var QS = require('querystring');
var path = require('path');
var URL = require('url');

function isNil(x) {
  return x === undefined || x === null;
}

function propEither(prop, x, y) {
  return isNil(y[prop]) ? x[prop] : y[prop];
}

function Merge(x, y) {
  if (isNil(x)) x = {};
  if (isNil(y)) y = {};

  if (typeof x === 'string') x = QS.parse(x);
  if (typeof y === 'string') y = QS.parse(y);

  if (typeof x !== 'object' || typeof y !== 'object') throw new TypeError('Invalid merge parameter.');

  return Object.assign({}, x, y);
}

function PathJoin(x, y) {

  if (typeof x !== 'string') x = '';
  if (typeof y !== 'string') y = '';

  return path.posix.join(x, y);
}

function UrlJoin(x, y) {
  if (x === null || x === undefined) x = '';
  if (y === null || y === undefined) y = '';

  const y_url = URL.parse(y);

  if (y_url.protocol) return y;

  const x_url = URL.parse(x);

  const z_url = Object.assign(x_url, {
    hostname: propEither('hostname', x_url, y_url),
    pathname: PathJoin(x_url.pathname, y_url.pathname),
    query: Merge(x_url.query, y_url.query),
    hash: propEither('hash', x_url, y_url)

    // The following properties are nullified because they will
    // override any merge attempts if they have a value.
    , href: undefined,
    path: undefined,
    search: undefined
  });

  return URL.format(z_url);
}

const DEFAULT_INPUT = {
  url: undefined,
  method: "GET",
  headers: {},
  query: {},
  body: {},
  auth: undefined,
  is_json: false,
  encoding: "utf8",
  timeout: undefined,
  retries: undefined,
  followRedirect: undefined
};

function AuthToString(a) {
  return `${ a.user }:${ a.password }`;
}

function InputToLibraryOptions(i) {

  return {
    url: i.url,
    method: i.method || "GET",
    headers: i.headers,
    query: i.query,
    body: i.body,
    auth: i.auth ? AuthToString(i.auth) : undefined,
    is_json: i.is_json,
    encoding: i.encoding,
    timeout: i.timeout,
    retries: i.retries,
    followRedirect: i.followRedirect
  };
}

function __mergeTimeoutOpt(x, y) {
  if (x === undefined) return y;
  if (y === undefined) return x;

  if (typeof x === 'object' && typeof y === 'object') return Object.assign({}, x, y);

  return y;
}

function InputMerge(x, y) {

  if (!x) return y;
  if (!y) return x;

  return {
    url: UrlJoin(x.url, y.url),
    method: propEither('method', x, y),
    headers: Object.assign({}, x.headers, y.headers),
    query: Merge(x.query, y.query),
    body: Merge(x.body, y.body),
    auth: propEither('auth', x, y),
    is_json: propEither('is_json', x, y),
    encoding: propEither('encoding', x, y),
    timeout: __mergeTimeoutOpt(x.timeout, y.timeout),
    retries: propEither('retries', x, y),
    followRedirect: propEither('followRedirect', x, y)
  };
}

function __InputReducer(x, y) {
  return InputMerge(x, y);
}

function InputMergeAll(...args) {
  return args.reduce(__InputReducer, DEFAULT_INPUT);
}

// method configuration factory
function mcf(method) {
  return { method: method };
}

function __run(lib, url, ...i) {

  const options = InputToLibraryOptions(InputMergeAll.apply(null, i));

  return lib(UrlJoin(options.url, url), options);
}

function methodFactory(lib, c, m) {

  return function client(url, options) {
    return __run(lib, url, c, m, options);
  };
}

function Factory(lib, c) {

  function client(url, options) {

    return __run(lib, url, c, options);
  }
  client.get = methodFactory(lib, c, mcf("GET"));
  client.post = methodFactory(lib, c, mcf("POST"));
  client.put = methodFactory(lib, c, mcf("PUT"));
  client.patch = methodFactory(lib, c, mcf("PATCH"));
  client.head = methodFactory(lib, c, mcf("HEAD"));
  client.delete = methodFactory(lib, c, mcf("DELETE"));

  return client;
}

// Marking lib as any so that we can make testing a bit easier. This
// allows us to just send in any object and hope that it supplies
// the proper interface.  Since we're just using `got` in the
// default (and probably only) case this should be fine.
function GotClient(u, lib) {

  return Factory(lib || got, u);
}

module.exports = GotClient;
