# fastfall

call your callbacks in a waterfall, without overhead

Benchmark for doing 3 calls `setImmediate` 100 thousands times:

* non-reusable setImmediate: 559ms
* `async.waterfall`: 2193ms
* `fastfall`: 778ms
* `fastfall` compiled: 782ms

These benchmarks where taken via `bench.js` on iojs 2.2.1, on a MacBook
Pro Retina 2014, on battery, on a plane to London.

If you need zero-overhead series function call, check out
[fastseries](http://npm.im/fastseries), for parallel calls check out
[fastparallel](http://npm.im/fastparallel), and for a fast work queue
use [fastq](http://npm.im/fastq).

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)

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

## License

ISC
