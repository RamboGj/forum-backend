import { describe, expect, it } from 'vitest'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from '@test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from '@test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Question Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-9',
      content: 'comment test',
      answerId: 'answer-1',
    })

    expect(answerCommentsRepository.items[0]?.content).toEqual('comment test')
  })
})
