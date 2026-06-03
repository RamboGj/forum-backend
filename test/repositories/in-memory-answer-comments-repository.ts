import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  async getById(answerCommentId: string): Promise<AnswerComment | null> {
    return (
      this.items.find((item) => item.id.toString() === answerCommentId) ?? null
    )
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )
    this.items.splice(itemIndex, 1)
  }

  async getManyByQuestionId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const SKIP = (page - 1) * 20

    return this.items
      .filter((item) => item.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(SKIP, page * 20)
  }
}
