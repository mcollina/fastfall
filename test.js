'use strict'

var test = require('tape')
var fastfall = require('./')

test('basically works', function (t) {
  t.plan(7)

  var fall = fastfall()

  fall([
    function a (cb) {
      cb(null, 'a')
    },
    function b (a, cb) {
      t.equal(a, 'a', 'second function arg matches')
      cb(null, 'a', 'b')
    },
    function c (a, b, cb) {
      t.equal(a, 'a', 'third function 1st arg matches')
      t.equal(b, 'b', 'third function 2nd arg matches')
      cb(null, 'a', 'b', 'c')
    }
  ], function result (err, a, b, c) {
    t.error(err, 'no error')
    t.equal(a, 'a', 'result function 2nd arg matches')
    t.equal(b, 'b', 'result function 3rd arg matches')
    t.equal(c, 'c', 'result function 4th arg matches')
  })
})

test('call with error', function (t) {
  t.plan(4)

  var fall = fastfall()

  fall([
    function a (cb) {
      cb(null, 'a')
    },
    function b (a, cb) {
      t.equal(a, 'a', 'second function arg matches')
      cb(new Error('this is expected!'), 'a', 'b')
    },
    function c (a, b, cb) {
      t.fail('this should never happen')
    }
  ], function result (err, a, b, c) {
    t.ok(err, 'error')
    t.notOk(a, 'no 2nd arg')
    t.notOk(b, 'no 3rd arg')
  })
})
