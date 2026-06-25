import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
    title,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.getById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.getManyByQuestionId(questionId)

    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      })
    })

    questionAttachmentsList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentsList

    const updatedQuestion = await this.questionsRepository.save(question)

    return right({ question: updatedQuestion })
  }
}
