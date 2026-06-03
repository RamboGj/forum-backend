import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
    create(answer: Answer): Promise<void>
    getById(answerId: string): Promise<Answer | null>
    delete(answer: Answer): Promise<void>
}