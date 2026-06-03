import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Either, right } from '@/core/either'

interface ListQuestionCommentsUseCaseRequest {
  page: number
  questionId: string
}

type ListQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionsComments: QuestionComment[]
  }
>

export class ListQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    page,
    questionId,
  }: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
    const questionsComments =
      await this.questionCommentsRepository.getManyByQuestionId(questionId, {
        page,
      })

    return right({ questionsComments })
  }
}
