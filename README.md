# setinterval

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/setinterval.svg?style=flat-square
[npm-url]: https://npmjs.org/package/setinterval
[download-image]: https://img.shields.io/npm/dm/setinterval.svg?style=flat-square
[download-url]: https://npmjs.org/package/setinterval

We all know the drawbacks of the built-in `setInterval` in Node.js(actually js itself).

It's more reasonable to start measuring period after every async task gets done. So here it is.

## Install
`$ npm i setinterval`

## Example
```js
  const Timer = require('setinterval');
  const t = new Timer(async () => {
    const user = await db.User.get(id);
    console.log(user);
  }, 1000);

  // start timer
  t.setInterval();

  // after some time...

  // clear timer
  t.clearInterval();
```

## API

### new Timer(fn, period)

Timer contructor.

Params:
  - fn(*required*): function excuted after every `period`. Should be a Promise or async function or generator function or thunk.
  - period(*required*): timer period(*units: milliseconds*).

### setInterval(initialDelay)

Start timer after a certain delay if specified.

Params:
  - initialDelay(*optional*): Delay period(*units: milliseconds*) before timer gets triggered. *default: undefined*

### clearInterval()

Stop timer(can be restart again).

## Events

### tick

Triggered each time fn is finished, whenever a error is thrown. You can cancel the timer in this event. A `count` parameter is passed in the event handler which stands for how many times fn has been called.

```js
timer.on('tick', count => {
  timer.clearInterval();
});
```

### error

Triggered when error thrown from fn.

```js
timer.on('error', e => {
  logger.info(e.stack);
});
```

## License
MIT
