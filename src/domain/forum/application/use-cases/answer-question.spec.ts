import { describe, expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'

let questionsRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(questionsRepository)
  })

  it('should be able to answer question', async () => {
    const result = await sut.execute({
      content: 'Nova resposta',
      instructorId: '1',
      questionId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('Nova resposta')
    expect(questionsRepository.items[0]?.id).toEqual(result.value?.answer.id)
  })
})
