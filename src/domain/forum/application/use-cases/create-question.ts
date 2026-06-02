import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"

interface CreateQuestionUseCaseRequest {
    title: string
    authorId: string
    content: string
}

interface CreateQuestionUseCaseResponse {
    question: Question
}

export class CreateQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ authorId, title, content }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
        const question = Question.create({ 
            authorId: new UniqueEntityID(authorId),
            content,
            title
        })

        await this.questionsRepository.create(question)

        return { question }
    }
}