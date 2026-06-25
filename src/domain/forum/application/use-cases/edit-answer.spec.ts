import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '@test/factories/make-answer-attachment'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
/* sut => system under test */
let sut: EditAnswerUseCase

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      content: 'Novo conteudo teste',
      answerId: 'answer-1',
      attachmentsIds: ['1', '3'],
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: 'Novo conteudo teste',
    })
    expect(answersRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit answer from another author', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-99',
      answerId: 'answer-1',
      content: 'Novo conteudo teste',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit inexistent answer', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'Novo conteudo teste',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
