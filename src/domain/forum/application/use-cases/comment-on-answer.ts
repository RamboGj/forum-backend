import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswersRepository } from "../repositories/answers-repository"
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"

interface CommentOnAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
}

interface CommentOnAnswerUseCaseResponse {
    answerComment: AnswerComment
}

export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            throw new EntityNotFoundError()
        }
        
        const comment = AnswerComment.create({ 
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content,
        })

         await this.answerCommentsRepository.create(comment)

        return { answerComment: comment }
    }
}