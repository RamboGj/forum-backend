import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  getManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
}
