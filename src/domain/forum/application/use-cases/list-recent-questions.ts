import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'

interface ListRecentQuestionsUseCaseRequest {
  page: number
}

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: ListRecentQuestionsUseCaseRequest): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.getManyRecent({ page })

    return right({ questions })
  }
}
