import { describe, expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer question', async () => {
    const result = await sut.execute({
      content: 'Nova resposta',
      instructorId: '1',
      questionId: '1',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('Nova resposta')
    expect(answersRepository.items[0]?.id).toEqual(result.value?.answer.id)
    expect(result.value?.answer.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
