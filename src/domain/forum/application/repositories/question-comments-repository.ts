import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  getById(id: string): Promise<QuestionComment | null>
  create(comment: QuestionComment): Promise<void>
  delete(comment: QuestionComment): Promise<void>
  getManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
