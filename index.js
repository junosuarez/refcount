var EventEmitter = require('events').EventEmitter
var util = require('util')

function refcount(init) {
  if (!(this instanceof refcount)) {
    return new refcount(init)
  }
  this.i = init || 0;
}

util.inherits(refcount, EventEmitter)

refcount.prototype.push = function (x) {
  if(x === void 0) { x = 1 }
  this.i += x

  this.emit('push', x, this.i)

  return this.i
}
refcount.prototype.pop = function (x) {
  if(x === void 0) { x = 1 }
  this.i = Math.max(this.i - x, 0)

  this.emit('pop', x, this.i)

  if (this.i === 0) {
    this.emit('clear')
  }

  return this.i
}

module.exports = refcount