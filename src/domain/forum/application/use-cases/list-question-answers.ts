import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'

interface ListQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type ListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class ListQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.getManyByQuestionId(
      questionId,
      { page },
    )

    return right({ answers })
  }
}
