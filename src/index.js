class CancellationError extends Error {}
CancellationError.prototype.name = 'CancellationError'
CancellationError.prototype.cancelled = true

function deferred () {
  let _resolve, _reject
  const promise = new Promise(function (resolve, reject) {
    _resolve = resolve
    _reject = reject
  })
  return {promise, resolve: _resolve, reject: _reject}
}

function cancellable (fn) {
  let cancelled = false
  const {promise, resolve, reject} = deferred()
  const cancellation = new Promise(function (resolve, reject) {
    promise.then(resolve, resolve)
    promise.cancel = function (reason) {
      cancelled = true
      reject(new CancellationError(reason || 'cancelled'))
    }
  })
  fn(cancellation, function () {
    return cancelled
  }).then(resolve, reject)
  return promise
}

cancellable.CancellationError = CancellationError
module.exports = cancellable
