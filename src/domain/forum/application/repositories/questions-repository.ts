import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionsRepository {
    create(question: Question): Promise<void>
    getBySlug(slug: string): Promise<Question | null>
    getById(questionId: string): Promise<Question | null>
    getManyRecent(params: PaginationParams): Promise<Question[]>
    delete(question: Question): Promise<void>
    save(question: Question): Promise<Question>
}