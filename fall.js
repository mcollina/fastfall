'use strict'

var reusify = require('reusify')
var empty = []

function fastfall (context, template) {
  if (Array.isArray(context)) {
    template = context
    context = null
  }

  var queue = reusify(Holder)

  return template ? compiled : fall

  function fall () {
    var current = queue.get()
    current.release = release

    if (arguments.length === 3) {
      current.context = arguments[0]
      current.list = arguments[1]
      current.callback = arguments[2] || noop
    } else {
      current.context = context
      current.list = arguments[0]
      current.callback = arguments[1] || noop
    }

    if (current.context) {
      current.callFunc = callThat
    } else {
      current.callFunc = justCall
    }

    current.work()
  }

  function release (holder) {
    holder.context = undefined
    holder.list = empty
    holder.count = 0
    holder.callback = noop
    queue.release(holder)
  }

  function compiled () {
    var current = queue.get()
    current.release = release

    current.list = template

    var args = new Array(arguments.length)
    var i

    args[0] = null // first arg is the error

    for (i = 0; i < arguments.length - 1; i++) {
      args[i + 1] = arguments[i]
    }

    current.context = this || context
    current.callback = arguments[i] || noop
    current.callFunc = callThat

    justCall(null, current.work, args)
  }
}

function noop () {}

function Holder () {
  this.list = empty
  this.callback = noop
  this.count = 0
  this.context = undefined
  this.release = noop
  this.callFunc = noop

  var that = this

  this.work = function work () {
    var len = arguments.length
    var i
    var func
    var args
    if (arguments.length > 0 && arguments[0]) {
      that.callback.call(that.context, arguments[0])
    } else if (that.count < that.list.length) {
      len = len || 1
      args = new Array(len)
      func = that.list[that.count++]
      for (i = 1; i < len; i++) {
        args[i - 1] = arguments[i]
      }
      args[len - 1] = that.work
      that.callFunc(that, func, args)
    } else {
      args = new Array(len)
      for (i = 0; i < len; i++) {
        args[i] = arguments[i]
      }
      that.callFunc(that, that.callback, args)
      that.release(that)
    }
  }
}

function callThat (that, func, args) {
  switch (args.length) {
    case 1:
      return func.call(that.context, args[0])
    case 2:
      return func.call(that.context, args[0], args[1])
    case 3:
      return func.call(that.context, args[0], args[1], args[2])
    case 4:
      return func.call(that.context, args[0], args[1], args[2], args[3])
    default:
      func.apply(that.context, args)
  }
}

function justCall (that, func, args) {
  switch (args.length) {
    case 1:
      return func(args[0])
    case 2:
      return func(args[0], args[1])
    case 3:
      return func(args[0], args[1], args[2])
    case 4:
      return func(args[0], args[1], args[2], args[3])
    default:
      func.apply(null, args)
  }
}

module.exports = fastfall
