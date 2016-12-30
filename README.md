# setinterval

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/setinterval.svg?style=flat-square
[npm-url]: https://npmjs.org/package/setinterval
[download-image]: https://img.shields.io/npm/dm/setinterval.svg?style=flat-square
[download-url]: https://npmjs.org/package/setinterval

More reasonable setInterval for async task.

## Install
`$ npm i setinterval`

## Example
```js
  const Timer = require('setinterval');
  const t = new Timer(function*() {
    const user = yield db.User.get(id);
    console.log(user);
  }, 1000);

  // start timer
  t.setInterval();

  // xxxx
  t.clearInterval();
```

## API

- setInterval(fn, period)

fn should be a Promise, a generator function or a thunk.

- clearInterval()

cancel timer.

## Events

- tick

Triggered each time fn is finished, whenever a error is thrown. You can cancel the timer in this event. A `count` parameter is passed in the event handler which stands for how many times fn has been called.

```js
timer.on('tick', count => {
  timer.clearInterval();
});
```

- error

Triggered when error thrown from fn.

```js
timer.on('error', e => {
  logger.info(e.stack);
});
```

## License
MIT
