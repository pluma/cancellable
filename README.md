Helper for creating cancellable promise-returning functions.

[![license - MIT](https://img.shields.io/npm/l/cancellable.svg?style=flat-square)](http://foss-haas.mit-license.org) [![Dependencies](https://img.shields.io/david/foss-haas/cancellable.svg?style=flat-square)](https://david-dm.org/foss-haas/cancellable)

[![NPM status](https://nodei.co/npm/cancellable.png?compact=true)](https://www.npmjs.com/package/cancellable)

[![Build status](https://img.shields.io/travis/foss-haas/cancellable.svg?style=flat-square)](https://travis-ci.org/foss-haas/cancellable)

**Example:**

```js
import cancellable from 'cancellable'

const promise = cancellable((cancellation, cancelled) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', '/ajax')
  xhr.addEventListener('error', () => reject(new Error('Something went wrong')))
  xhr.addEventListener('load', () => resolve(xhr.response))
  xhr.send()
  cancellation.catch((reason) => {
    xhr.abort()
    reject(reason)
  })
}))

// later

promise.cancel()
```

## cancellable

Takes a promise-returning function that will be passed two arguments:

* **cancellation**: `Promise`

  A promise that will be rejected with a `CancellationError` if the `cancel` method was invoked or otherwise resolves to the fulfilled/rejected value of the promise returned by the function.

* **cancelled**: `() => boolean`

  A function that returns `true` if the `cancel` method was invoked or `false` otherwise. This function will return `true` even if the `cancel` method was invoked after the promise was fulfilled/rejected normally.

Returns the promise returned by the function but adds a `cancel` method that takes an optional argument:

* **message**: `string`

  A message that will be used to create a `CancellationError`. Rejects the promise if it hasn't already been fulfilled/rejected.

## cancellable.CancellationError

A subclass of `Error` that is used to reject cancelled promises.

As of 1.1.0 it also has a **cancelled** property (set to `true`) to easily distinguish it from other errors.

# License

The MIT/Expat license. For more information, see http://foss-haas.mit-license.org/ or the accompanying [LICENSE](https://github.com/foss-haas/cancellable/blob/master/LICENSE) file.
