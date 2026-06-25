import { describe, expect, it } from 'vitest'
import { ListQuestionAnswersUseCase } from './list-question-answers'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ListQuestionAnswersUseCase

describe('List Question Answers Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new ListQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to list question answers', async () => {
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to list paginated question answers', async () => {
    for (let i = 0; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({ questionId: 'question-1', page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })
})
