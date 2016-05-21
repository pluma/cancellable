/*globals describe, it */
import chai, {expect} from 'chai'
import sinonChai from 'sinon-chai'
import {spy} from 'sinon'
import cancellable, {CancellationError} from '../src'

chai.use(sinonChai)

describe('CancellationError', () => {
  it('is an Error', () => {
    const message = 'an error message'
    const error = new CancellationError(message)
    expect(error).to.be.an.instanceof(CancellationError)
    expect(error).to.have.a.property('message', message)
  })
  it('has a "cancelled" property', () => {
    const error = new CancellationError()
    expect(error).to.have.a.property('cancelled', true)
  })
})

describe('cancellable', () => {
  it('does what it says on the tin', (done) => {
    const wasResolved = spy()
    const wasRejected = spy()
    let wasCancelled
    const promise = cancellable((cancellation, cancelled) => new Promise((resolve, reject) => {
      let timeout
      cancellation.catch((err) => {
        wasCancelled = cancelled()
        clearTimeout(timeout)
        reject(err)
      })
      timeout = setTimeout(() => {
        resolve('resolved')
      })
    }))
    promise.then(wasResolved, wasRejected)
    const message = 'cancellation message'
    promise.cancel(message)
    setTimeout(() => {
      expect(wasCancelled).to.equal(true)
      expect(wasRejected).to.have.callCount(1)
      const args = wasRejected.firstCall.args
      expect(args.length).to.equal(1)
      expect(args[0]).to.be.an.instanceof(CancellationError)
      expect(args[0]).to.have.a.property('message', message)
      done()
    })
  })
})
