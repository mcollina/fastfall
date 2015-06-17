# fastfall&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/fastfall.svg?branch=master)](https://travis-ci.org/mcollina/fastfall)


call your callbacks in a waterfall, without overhead

Benchmark for doing 3 calls `setImmediate` 100 thousands times:

* non-reusable setImmediate: 531ms
* [async.waterfall](https://github.com/caolan/async#waterfall): 1629ms
* [run-waterfall](http://npm.im/run-waterfall): 1282ms
* `fastfall`: 618ms
* `fastfall` compiled: 614ms

These benchmarks where taken via `bench.js` on iojs 2.2.1, on a MacBook
Pro Retina 2014, on battery, on a plane to London.

If you need zero-overhead series function call, check out
[fastseries](http://npm.im/fastseries), for parallel calls check out
[fastparallel](http://npm.im/fastparallel), and for a fast work queue
use [fastq](http://npm.im/fastq).

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)

## Install

```
npm install fastfall --save
```

## Usage

```js
var fall = require('./')()

fall([
  function a (cb) {
    console.log('called a')
    cb(null, 'a')
  },
  function b (a, cb) {
    console.log('called b with:', a)
    cb(null, 'a', 'b')
  },
  function c (a, b, cb) {
    console.log('called c with:', a, b)
    cb(null, 'a', 'b', 'c')
  }], function result (err, a, b, c) {
    console.log('result arguments', arguments)
  })
```

You can also set `this` in the functions:

```js
var that = { hello: 'world' }
var fall = require('./')(that)

fall([
  function a (cb) {
    console.log(this)
    console.log('called a')
    cb(null, 'a')
  },
  function b (a, cb) {
    console.log('called b with:', a)
    cb(null, 'a', 'b')
  },
  function c (a, b, cb) {
    console.log('called c with:', a, b)
    cb(null, 'a', 'b', 'c')
  }], function result (err, a, b, c) {
    console.log('result arguments', arguments)
  })
```

### Compile a waterfall

```js
var fall = require('./')([
  function a (arg, cb) {
    console.log('called a')
    cb(null, arg)
  },
  function b (a, cb) {
    console.log('called b with:', a)
    cb(null, 'a', 'b')
  },
  function c (a, b, cb) {
    console.log('called c with:', a, b)
    cb(null, 'a', 'b', 'c')
  }])

// a compiled fall supports arguments too!
fall(42, function result (err, a, b, c) {
  console.log('result arguments', arguments)
})
```

You can set `this` by doing:

```js
var that = { hello: 'world' }
var fall = require('./')(that, [
  function a (arg, cb) {
    console.log('this is', this)
    console.log('called a')
    cb(null, arg)
  },
  function b (a, cb) {
    console.log('called b with:', a)
    cb(null, 'a', 'b')
  },
  function c (a, b, cb) {
    console.log('called c with:', a, b)
    cb(null, 'a', 'b', 'c')
  }])

// a compiled fall supports arguments too!
fall(42, function result (err, a, b, c) {
  console.log('result arguments', arguments)
})
```

## License

ISC
