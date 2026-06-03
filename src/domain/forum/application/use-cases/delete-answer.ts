import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedToDeleteOtherAuthorEntity } from "@/errors/not-allowed-to-delete-other-author-entity"

interface DeleteAnswerUseCaseRequest {
    answerId: string
    authorId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository
    ) {}

    async execute({ answerId, authorId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            throw new EntityNotFoundError()
        }

        if (authorId !== answer.authorId.toString()) {
            throw new NotAllowedToDeleteOtherAuthorEntity()
        }

        await this.answersRepository.delete(answer)

        return {}
    }
}