import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
    create(answer: Answer): Promise<void>
    getById(answerId: string): Promise<Answer | null>
    getManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
    delete(answer: Answer): Promise<void>
    save(answer: Answer): Promise<Answer>
}