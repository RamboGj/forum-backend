import { EntityNotFoundError } from '@/errors/entity-not-found-error'
import { NotAllowed } from '@/errors/not-allowed-to-delete-other-author-entity'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.getById(answerCommentId)

    if (!answerComment) {
      throw new EntityNotFoundError()
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new NotAllowed()
    }

    await this.answerCommentsRepository.delete(answerComment)

    return {}
  }
}
