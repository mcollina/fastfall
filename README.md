# fastfall&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/fastfall.svg?branch=master)](https://travis-ci.org/mcollina/fastfall)


call your callbacks in a waterfall, without overhead

Benchmark for doing 3 calls `setImmediate` 100 thousands times:

* non-reusable setImmediate: 553ms
* [async.waterfall](https://github.com/caolan/async#waterfall): 1718ms
* [run-waterfall](http://npm.im/run-waterfall): 1321ms
* [insync.wasterfall](https://www.npmjs.com/package/insync#waterfall):
  2044ms
* [neo-async.wasterfall](http://suguru03.github.io/neo-async/doc/async.waterfall.html):
  600ms
* [waterfallize](http://npm.im/waterfallize): 907ms
* `fastfall`: 585ms
* `fastfall` compiled: 603ms

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
var fall = require('fastfall')()

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

You can also set `this` when you create a fall:

```js
var that = { hello: 'world' }
var fall = require('fastfall')(that)

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

You can also set `this` when you run a task:

```js
var that = { hello: 'world' }
var fall = require('fastfall')()

fall(that, [
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
var fall = require('fastfall')([
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
var fall = require('fastfall')(that, [
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

or you can simply attach it to an object:

```js
var that = { hello: 'world' }
that.doSomething = require('fastfall')([
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
that.doSomething(42, function result (err, a, b, c) {
  console.log('this is', this)
  console.log('result arguments', arguments)
})
```

## API

### fastfall([this], [functions])

Creates a `fall`, it can either be pre-filled with a `this` value
and an array of functions.

If there is no list of functions, [a not-compiled fall](#not-compiled)
is returned, if there is a list of function [a compiled fall](#compiled)
is returned.

<a name="not-compiled"></a>
### fall([this], functions, [done])

Calls the functions in a waterfall, forwarding the arguments from one to
another. Calls `done` when it has finished.

<a name="compiled"></a>
### fall(args..., [done])

Calls the compiled functions in a waterfall, forwarding the arguments from one to
another. Additionally, a user can specify some arguments for the first
function, too. Calls `done` when it has finished.

## License

MIT
