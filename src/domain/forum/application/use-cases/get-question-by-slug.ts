import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"
import { EntityNotFoundError } from "@/errors/entity-not-found-error"

interface GetQuestionBySlugUseCaseRequest {
    slug: string
}

interface GetQuestionBySlugUseCaseResponse {
    question: Question
}

export class GetQuestionBySlugUseCase {
    constructor(
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.getBySlug(slug)

        if (!question) {
            throw new EntityNotFoundError()
        }

        return { question }
    }
}