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
    const timer = new Timer(function* () {
      yield sleep(50);
    }, 100);
    timer.setInterval()
      .clearInterval();

    assert(!timer._timer);
    done();
  });

  it('should emit error event', done => {
    const timer = new Timer(function* () {
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
    const timer = new Timer(function* () {
      yield sleep(50);
    }, 100);
    timer.setInterval();

    setTimeout(() => {
      timer.on('tick', count => {
        assert(count === 2);
        timer.clearInterval();
        done();
      });
    }, 200);
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
    const timer = new Timer(function* () {
      yield sleep(50);
    }, 100);
    timer.setInterval();

    timer.on('tick', () => {
      timer.clearInterval();
      done();
    });
  });

  it('should support async function', done => {
    const timer = new Timer(async () => {
      await sleep(50);
    }, 100);
    timer.setInterval();

    timer.on('tick', () => {
      timer.clearInterval();
      done();
    });
  });

  it('should throw error when fn is invalid', done => {
    const timer = new Timer(1, 100);
    timer.setInterval();

    timer.on('error', e => {
      assert(e.message.indexOf('[Timer]: fn should be') > -1);
      timer.clearInterval();
      done();
    });
  });

  it('should support initial delay', done => {
    let flag = false;
    const timer = new Timer(async () => {
      flag = true;
    }, 100);
    timer.setInterval(100);
    timer.on('tick', () => {
      assert.equal(flag, true);
      timer.clearInterval();
      done();
    });
    setTimeout(() => {
      assert.equal(flag, false);
    }, 150);
  });

  it('should support invoke immediately', done => {
    let count = 0;
    const timer = new Timer(async () => {
      ++count;
    }, 100);
    timer.setInterval(true);
    setTimeout(() => {
      assert.strictEqual(count, 1);
    }, 50);
    setTimeout(() => {
      assert.strictEqual(count, 2);
      done();
    }, 150);
  });
});

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
