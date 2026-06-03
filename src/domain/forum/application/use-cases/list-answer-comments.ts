import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Either, right } from '@/core/either'

interface ListAnswerCommentsUseCaseRequest {
  page: number
  answerId: string
}

type ListAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId,
  }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.getManyByQuestionId(answerId, {
        page,
      })

    return right({ answerComments })
  }
}
