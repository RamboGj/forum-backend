import { NotAllowed } from "@/errors/not-allowed-to-delete-other-author-entity"
import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface EditAnswerUseCaseRequest {
    answerId: string
    authorId: string
    content: string
}

 
interface EditAnswerUseCaseResponse {
    answer: Answer
}

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository
    ) {}

    async execute({ authorId, content, answerId }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            throw new EntityNotFoundError()
        }

        if (authorId !== answer.authorId.toString()) {
            throw new NotAllowed()
        }

        answer.content = content

        const updatedAnswer = await this.answersRepository.save(answer)

        return { answer: updatedAnswer }
    }
}