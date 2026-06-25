import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = []

  async getManyByAnswerId(questionId: string): Promise<AnswerAttachment[]> {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
  }

  async deleteManyByAnswerId(questionId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = answerAttachments
  }
}
