# refcount
count things on an observable stack

## installation

    $ npm install refcount

## usage

let's say you're streaming some things

    stream.on('data', function (x) {
      // do stuff async with x
    })

and you want to add a final step after all the async stuff is done. With `refcount`, we can keep track of how many requests we've sent off and be notified when they've all been handled:

    var refcount = require('refcount')

    var counter = refcount()

    stream.on('data', function (x) {
      counter.push()
      doStuff(x, function () {
        counter.pop()
      })
    })

    counter.on('clear', function () {
      console.log('we\'re all done here!')
    })

We can check the current counter number like so:

    counter.i

It also keeps track of the high water mark, that is, the highest value the counter ever reached:

    var counter = refcount(20)
    counter.pop(15)

    counter.i
    // => 5

    counter.highwater
    // => 20

We can also listen for push and pop events using the standard EventEmitter interface:

    counter.on('push', function () {
      console.log('add one')
    })

    counter.on('pop', function () {
      console.log('subtract one')
    })

For memory purposes, consider using `.once`:

    counter.once('clear', function () {
      console.log('done')
    })



## api

### refcount(), refcount(initial : Number)
Initializes a new `refcount`er. If an `initial` count is not specified, it defaults to 0.

### refcount#push(), refcount#push(delta : Number)
Increments the count by 1 or `delta`. Returns the current counter value.

### refcount#pop(), refcount#pop(delta : Number)
Decrements the count by 1 or `delta`, to a minimum of 0. Returns the current counter value.

### refcount#i : Number
The current counter value

### refcount#highwater : Number
The highest counter value

## events

### clear: no arguments
Fires when a `.pop` operations results in the counter getting down to zero.

### push: delta : Number, totalCount : Number
Fires after a push event. `delta` is the number added to the total count, and `totalCount` is the new total after the push operation.


### pop: delta : Number, totalCount : Number
Fires after a pop event. `delta` is the number subtracted from the total count, and `totalCount` is the new total after the pop operation.

## running the tests

    $ npm test

## contributors

jden <jason@denizac.org>

## license

MIT. (c) 2013 Agile Diagnosis <hello@agilediagnosis.com>. See LICENSE.md