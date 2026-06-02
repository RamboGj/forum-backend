import { QuestionNotFoundError } from "@/errors/question-not-found-error"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"

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
            throw new QuestionNotFoundError()
        }

        return { question }
    }
}