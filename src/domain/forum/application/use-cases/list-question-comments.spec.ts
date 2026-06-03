import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ListQuestionCommentsUseCase } from './list-question-comments'
import { InMemoryQuestionCommentsRepository } from '@test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from '@test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: ListQuestionCommentsUseCase

describe('List Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new ListQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to list question comments', async () => {
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const { questionsComments } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(questionsComments).toHaveLength(3)
  })

  it('should be able to list paginated question comments', async () => {
    for (let i = 0; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const { questionsComments } = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(questionsComments).toHaveLength(3)
  })
})
