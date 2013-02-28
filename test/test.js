var chai = require('chai')
chai.should()
chai.use(require('chai-interface'))


var refcount = require('../index')

describe('refcount', function () {
  it('doesnt need new', function () {
    var x = refcount()
    x.should.be.instanceof(refcount)
  })
  it('has interface', function () {
    var x = refcount()
    x.should.have.interface({
      push: Function,
      pop: Function,
      i: Number
    })
  })
  it('is initialized to 0 by default', function () {
    var x = refcount()
    x.i.should.equal(0)
  })
  it('can be initialized to a value', function () {
    var x = refcount(108)
    x.i.should.equal(108)
  })

  describe('events', function () {
    it('emits push on push', function (done) {
      var x = refcount(1)
      x.on('push', function (delta, count) {
        delta.should.equal(1)
        count.should.equal(2)
        done()
      })
      x.push()
    })
    it('emits pop on pop', function (done) {
      var x = refcount(1)
      x.on('pop', function (delta, count) {
        delta.should.equal(1)
        count.should.equal(0)
        done()
      })
      x.pop()
    })
    it('emits clear when a pop causes the count to reach 0', function (done) {
      var x = refcount(1)
      x.on('clear', function () {
        done()
      })
      x.pop()
    })
  })

  describe('#push', function () {
    it('increments the count by 1 by default', function () {
      var x = refcount()
      x.i.should.equal(0)
      x.push()
      x.i.should.equal(1)
    })
    it('increments the count by its argument value', function () {
      var x = refcount()
      x.i.should.equal(0)
      x.push(10)
      x.i.should.equal(10)
    })
  })

  describe('#pop', function () {
    it('decrements the count by 1 by default', function () {
      var x = refcount(23)
      x.i.should.equal(23)
      x.pop()
      x.i.should.equal(22)
    })
    it('decrements the count by its argument value', function () {
      var x = refcount(23)
      x.i.should.equal(23)
      x.pop(10)
      x.i.should.equal(13)
    })
    it('sets the count to 0 if decrementing by more than the total count', function () {
      var x = refcount(23)
      x.i.should.equal(23)
      x.pop(100)
      x.i.should.equal(0)
    })
  })

  describe('#highwater', function () {
    it('describes the maximum value of the counter', function () {
      var x = refcount(20)
      x.push()
      x.push()
      x.i.should.equal(22)
      x.pop()
      x.pop()
      x.pop()
      x.i.should.equal(19)
      x.highwater.should.equal(22)
    })
  })
})