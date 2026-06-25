import { describe, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '@test/factories/make-question-attachment'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
/* sut => system under test */
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },

      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(questionsRepository.items).toHaveLength(0)
    expect(questionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question from another author', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-99',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete inexistent question', async () => {
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
