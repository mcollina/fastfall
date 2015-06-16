'use strict'

var empty = []

function fastfall (context, template) {

  if (Array.isArray(context)) {
    template = context
    context = null
  }

  var head = new Holder(context, release)
  var tail = head

  return template ? compiled : fall

  function next () {
    var holder = head

    if (holder.next) {
      head = holder.next
    } else {
      head = new Holder(context, release)
      tail = head
    }

    holder.next = null

    return holder
  }

  function fall (list, done) {
    var current = next()

    current.list = list
    current.callback = done

    current.work()
  }

  function release (holder) {
    tail.next = holder
    tail = holder
  }

  function compiled () {
    var current = next()

    current.list = template

    var args = []
    var i

    args[0] = null // first arg is the error

    for (i = 0; i < arguments.length - 1; i++) {
      args[i + 1] = arguments[i]
    }

    current.callback = arguments[i]

    current.work.apply(null, args)
  }
}

function noop () {}

function Holder (context, release) {
  this.list = empty
  this.callback = noop
  this.count = 0

  var that = this

  this.work = function work () {
    if (arguments[0]) {
      // handle error
      return that.callback(arguments[0])
    }

    var args = []
    var i = 0

    if (that.count < that.list.length) {
      for (i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i]
      }
      args[args.length] = work
      that.list[that.count++].apply(context, args)
    } else {
      for (i = 0; i < arguments.length; i++) {
        args[i] = arguments[i]
      }
      that.callback.apply(context, args)
      that.list = empty
      that.count = 0
      release(that)
    }
  }
}

module.exports = fastfall
