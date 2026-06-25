import { describe, expect, it } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
/* sut => system under test */
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      content: 'Nova resposta',
      authorId: '1',
      title: 'Novo titulo',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question.title).toEqual('Novo titulo')
    expect(result.value?.question.slug.value).toEqual('novo-titulo')
    expect(result.value?.question.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
