'use strict';

const assert = require('assert');
const Timer = require('..');

describe('test/timer.test.js', () => {
  it('should setInterval', done => {
    const timer = new Timer(cb => {
      setTimeout(cb, 50);
    }, 100);
    timer.setInterval();

    setTimeout(() => {
      assert(timer._count > 5);
      timer.clearInterval();
      assert(timer._count === 0);
      done();
    }, 1000);
  });

  it('should clearInterval', done => {
    const timer = new Timer(function*() {
      yield sleep(50);
    }, 100);
    timer.setInterval()
      .clearInterval();

    assert(!timer._timer);
    done();
  });

  it('should emit error event', done => {
    const timer = new Timer(function*() {
      yield sleep(50);
      throw new Error('task error!');
    }, 100);
    timer.setInterval();

    timer.on('error', e => {
      assert(e.message.indexOf('task error!') > -1);
      timer.clearInterval();
      done();
    });
  });

  it('should emit tick event', done => {
    const timer = new Timer(function*() {
      yield sleep(50);
    }, 100);
    timer.setInterval();

    timer.on('tick', () => {
      timer.clearInterval();
      done();
    });
  });

  it('should support promise', done => {
    const timer = new Timer(Promise.resolve(), 100);
    timer.setInterval();

    timer.on('tick', () => {
      timer.clearInterval();
      done();
    });
  });

  it('should support thunk', done => {
    const timer = new Timer(function(cb) {
      cb(new Error('thunk error'));
    }, 100);
    timer.setInterval();

    timer.on('error', e => {
      assert(e.message.indexOf('thunk error') > -1);
      timer.clearInterval();
      done();
    });
  });

  it('should support generator function', done => {
    const timer = new Timer(function*() {
      yield sleep(50);
    }, 100);
    timer.setInterval();

    timer.on('tick', e => {
      timer.clearInterval();
      done();
    });
  });

  it('should throw error when fn is invalid', done => {
    try {
      const timer = new Timer(1, 100);
      timer.setInterval();
    } catch (e) {
      assert(e.message.indexOf('[Timer]: fn should be') > -1);
      done();
    }
  });

});

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
