import { Question } from "../../enterprise/entities/question";

export interface QuestionsRepository {
    create(question: Question): Promise<void>
    getBySlug(slug: string): Promise<Question | null>
    getById(questionId: string): Promise<Question | null>
    delete(question: Question): Promise<void>
}