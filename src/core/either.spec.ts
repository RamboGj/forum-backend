import { describe, it } from 'vitest'
import { Either, left, right } from './either'

function doSomething(shouldSucceed: boolean): Either<string, number> {
  if (shouldSucceed) return right(10)
  return left('error')
}

describe('Either', () => {
  it('success result', () => {
    const successResult = doSomething(true)
    if (successResult.isRight()) {
      console.log(successResult.value)
    }

    expect(successResult.isRight()).toBe(true)
  })

  it('error result', () => {
    const result = doSomething(false)
    expect(result.isLeft()).toBe(true)
  })
})
