import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '@test/factories/make-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
        answerId: new UniqueEntityID('answer-1'),
      },
      new UniqueEntityID('answer-comment-1'),
    )

    await answerCommentsRepository.create(newAnswerComment)

    await sut.execute({
      authorId: 'author-1',
      answerCommentId: 'answer-comment-1',
    })

    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
        answerId: new UniqueEntityID('answer-1'),
      },
      new UniqueEntityID('answer-comment-1'),
    )

    await answerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: 'author-9',
      answerCommentId: 'answer-comment-1',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
