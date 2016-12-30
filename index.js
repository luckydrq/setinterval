'use strict';

const assert = require('assert');
const EventEmitter = require('events');
const co = require('co');
const is = require('is-type-of');

class Timer extends EventEmitter {
  constructor(fn, period) {
    assert(fn, '[Timer]: fn required!');
    assert(period, '[Timer]: period required!');
    assert(is.number(period), '[Timer]: period should be a number!');

    super();

    this._fn = fn;
    this._period = period;
    this._continue = false;
    this._timer = null;
    this._count = 0;
  }

  _task() {
    const fn = toPromise(this._fn);

    Promise.resolve()
      .then(() => {
        assert(fn, '[Timer]: fn should be a Promise, a generator function, a thunk or a normal function');
        return fn;
      })
      .catch(e => this.emit('error', e))
      .then(() => {
        ++this._count;
        this.emit('tick', this._count);

        // check if we should contiue
        if (this._continue) {
          this.setInterval();
        }
      });
  }

  setInterval() {
    this._continue = true;
    this._timer = setTimeout(() => this._task(), this._period);
    return this;
  }

  clearInterval() {
    this._continue = false;
    this._count = 0;

    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    return this;
  }
}

function toPromise(fn) {
  if (is.promise(fn)) {
    return fn;
  }

  if (is.generatorFunction(fn)) {
    return co(fn);
  }

  if (is.function(fn)) {
    if (fn.length === 1) {
      // consider fn as a thunk
      return new Promise((resolve, reject) => {
        fn(err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }

  return null;
}

module.exports = Timer;
