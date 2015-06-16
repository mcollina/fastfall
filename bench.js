var max = 100000
var series = require('fastseries')()
var async = require('async')
var fall = require('./')()

function bench (func, done) {
  var key = max + '*' + func.name
  var count = -1

  console.time(key)
  end()

  function end () {
    if (++count < max) {
      func(end)
    } else {
      console.timeEnd(key)
      if (done) {
        done()
      }
    }
  }
}

var nextDone
var nextCount

function benchSetImmediate (done) {
  nextCount = 3
  nextDone = done
  setImmediate(somethingImmediate)
}

function somethingImmediate () {
  nextCount--
  if (nextCount === 0) {
    nextDone()
  } else {
    setImmediate(somethingImmediate)
  }
}

function somethingB (arg, cb) {
  setImmediate(cb, null, arg)
}

function somethingA (cb) {
  setImmediate(cb, null, 'a')
}

var toCall = [somethingA, somethingB, somethingB]
function benchAsyncWaterfall (done) {
  async.waterfall(toCall, done)
}

function benchFastFall (done) {
  fall(toCall, done)
}

var compiled = require('./')(toCall)

function noop () {}

function run (next) {
  series(null, bench, [
    benchAsyncWaterfall,
    benchFastFall,
    benchSetImmediate,
    compiled
  ], next || noop)
}

run(run)
