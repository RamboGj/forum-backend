import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  getById(id: string): Promise<AnswerComment | null>
  create(comment: AnswerComment): Promise<void>
  delete(comment: AnswerComment): Promise<void>
  getManyByQuestionId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
