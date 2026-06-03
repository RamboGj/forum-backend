import { EntityNotFoundError } from "@/errors/entity-not-found-error"
import { Question } from "../../enterprise/entities/question"
import { AnswersRepository } from "../repositories/answers-repository"
import { QuestionsRepository } from "../repositories/questions-repository"
import { NotAllowed } from "@/errors/not-allowed-to-delete-other-author-entity"

interface ChooseQuestionBestAnswerUseCaseRequest {
    authorId: string
    answerId: string
}


interface ChooseQuestionBestAnswerUseCaseResponse {
    question: Question
}

export class ChooseQuestionBestAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ answerId, authorId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            throw new EntityNotFoundError()
        }
        
        const question = await this.questionsRepository.getById(answer.questionId.toString())

        if (!question) {
            throw new EntityNotFoundError()
        }

        if (authorId !== question.authorId.toString()) {
            throw new NotAllowed()
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return { question }
    }
}