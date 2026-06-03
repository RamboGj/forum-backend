import { NotAllowedToDeleteOtherAuthorEntity } from "@/errors/not-allowed-to-delete-other-author-entity"
import { QuestionsRepository } from "../repositories/questions-repository"
import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { Question } from "../../enterprise/entities/question"

interface EditQuestionUseCaseRequest {
    questionId: string
    authorId: string
    title: string
    content: string
}

 
interface EditQuestionUseCaseResponse {
    question: Question
}

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ questionId, authorId, content, title }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            throw new EntityNotFoundError()
        }

        if (authorId !== question.authorId.toString()) {
            throw new NotAllowedToDeleteOtherAuthorEntity()
        }

        question.title = title
        question.content = content

        const updatedQuestion = await this.questionsRepository.save(question)

        return { question: updatedQuestion }
    }
}