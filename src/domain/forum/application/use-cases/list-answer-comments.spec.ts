import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from '@test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '@test/factories/make-answer-comment'
import { ListAnswerCommentsUseCase } from './list-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: ListAnswerCommentsUseCase

describe('List Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new ListAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to list question comments', async () => {
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(answerComments).toHaveLength(3)
  })

  it('should be able to list paginated question comments', async () => {
    for (let i = 0; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(answerComments).toHaveLength(3)
  })
})
