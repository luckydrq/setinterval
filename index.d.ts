import EventEmitter from 'events';

type FnType = Promise<void> | GeneratorFunction | (() => Promise<void>) | ((cb: (err?: Error) => void) => void);

declare class Timer extends EventEmitter {
  constructor(fn: FnType, period?: number);
  setInterval: (initialDelay?: number | boolean, invokeImmediate?: boolean) => Timer;
  clearInterval: () => this;
}

export = Timer;