import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { QuestionCommentsRepository } from "../repositories/question-comments-repository"
import { NotAllowed } from "@/errors/not-allowed-to-delete-other-author-entity"

interface DeleteQuestionCommentUseCaseRequest {
    authorId: string
    questionCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
        const questionComment = await this.questionCommentsRepository.getById(questionCommentId)

        if (!questionComment) {
            throw new EntityNotFoundError()
        }

        if (questionComment.authorId.toString() !== authorId) {
            throw new NotAllowed()
        }
        
         await this.questionCommentsRepository.delete(questionComment)

        return {}
    }
}