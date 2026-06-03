import { NotAllowed } from "@/errors/not-allowed-to-delete-other-author-entity"
import { QuestionsRepository } from "../repositories/questions-repository"
import { EntityNotFoundError } from "@/errors/entity-not-found-error"

interface DeleteQuestionUseCaseRequest {
    questionId: string
    authorId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ questionId, authorId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            throw new EntityNotFoundError()
        }

        if (authorId !== question.authorId.toString()) {
            throw new NotAllowed()
        }

        await this.questionsRepository.delete(question)

        return {}
    }
}