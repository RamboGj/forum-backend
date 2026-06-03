import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from '@test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from '@test/factories/make-question-comment'
import { NotAllowed } from '@/errors/not-allowed-to-delete-other-author-entity'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
        questionId: new UniqueEntityID('question-1'),
      },
      new UniqueEntityID('question-comment-1'),
    )

    await questionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-1',
      questionCommentId: 'question-comment-1',
    })

    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
        questionId: new UniqueEntityID('question-1'),
      },
      new UniqueEntityID('question-comment-1'),
    )

    await questionCommentsRepository.create(newQuestionComment)

    await await expect(
      sut.execute({
        authorId: 'author-9',
        questionCommentId: 'question-comment-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowed)
  })
})
