'use strict'

var empty = []

function fastfall (context, template) {

  if (Array.isArray(context)) {
    template = context
    context = null
  }

  var head = new Holder(release)
  var tail = head

  return template ? compiled : fall

  function next () {
    var holder = head

    if (holder.next) {
      head = holder.next
    } else {
      head = new Holder(release)
      tail = head
    }

    holder.next = null

    return holder
  }

  function fall () {
    var current = next()

    if (arguments.length === 3) {
      current.context = arguments[0]
      current.list = arguments[1]
      current.callback = arguments[2] || noop
    } else {
      current.context = context
      current.list = arguments[0]
      current.callback = arguments[1] || noop
    }

    current.work()
  }

  function release (holder) {
    tail.next = holder
    tail = holder
  }

  function compiled () {
    var current = next()

    current.list = template

    var args = new Array(arguments.length)
    var i

    args[0] = null // first arg is the error

    for (i = 0; i < arguments.length - 1; i++) {
      args[i + 1] = arguments[i]
    }

    current.context = this || context
    current.callback = arguments[i] || noop

    current.work.apply(null, args)
  }
}

function noop () {}

function Holder (release) {
  this.list = empty
  this.callback = noop
  this.count = 0
  this.context = undefined

  var that = this

  this.work = function work () {
    if (arguments.length > 0 && arguments[0]) {
      return that.callback.call(that.context, arguments[0])
    }

    var args = []
    var i = 0

    if (that.count < that.list.length) {
      for (i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i]
      }
      args[args.length] = work
      that.list[that.count++].apply(that.context, args)
    } else {
      for (i = 0; i < arguments.length; i++) {
        args[i] = arguments[i]
      }
      that.callback.apply(that.context, args)
      that.context = undefined
      that.list = empty
      that.count = 0
      release(that)
    }
  }
}

module.exports = fastfall
