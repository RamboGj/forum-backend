import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async getBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async getById(questionId: string): Promise<Question | null> {
    return this.items.find((item) => item.id.toString() === questionId) ?? null
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question): Promise<Question> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question

    return question
  }

  async getManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const SKIP = (page - 1) * 20

    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(SKIP, page * 20)
  }
}
