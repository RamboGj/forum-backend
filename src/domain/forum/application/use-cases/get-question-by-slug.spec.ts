import { describe, expect, it } from 'vitest'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@test/factories/make-question'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
/* sut => system under test */
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get question by slug', async () => {
    const questionCreated = makeQuestion({
      title: 'Novo Titulo',
    })

    await questionsRepository.create(questionCreated)

    const result = await sut.execute({ slug: 'novo-titulo' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.slug.value).toEqual('novo-titulo')
    }
  })

  it('should not be able to get question by inexistent slug', async () => {
    const questionCreated = makeQuestion({
      title: 'Novo Titulo',
    })

    await questionsRepository.create(questionCreated)

    const result = await sut.execute({ slug: 'random-slug' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
