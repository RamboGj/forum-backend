import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface ListQuestionCommentsUseCaseRequest {
  page: number
  questionId: string
}

interface ListQuestionCommentsUseCaseResponse {
  questionsComments: QuestionComment[]
}

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

    return { questionsComments }
  }
}
