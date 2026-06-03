import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { QuestionsRepository } from "../repositories/questions-repository"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { QuestionCommentsRepository } from "../repositories/question-comments-repository"

interface CommentOnQuestionUseCaseRequest {
    authorId: string
    questionId: string
    content: string
}

interface CommentOnQuestionUseCaseResponse {
    questionComment: QuestionComment
}

export class CommentOnQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            throw new EntityNotFoundError()
        }
        
        const comment = QuestionComment.create({ 
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
            content,
        })

         await this.questionCommentsRepository.create(comment)

        return { questionComment: comment }
    }
}