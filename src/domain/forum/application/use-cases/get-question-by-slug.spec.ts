import { describe, expect, it } from "vitest";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { QuestionNotFoundError } from "@/errors/question-not-found-error";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { makeQuestion } from "@test/factories/make-question";

let questionsRepository: InMemoryQuestionsRepository
/* sut => system under test */
let sut: GetQuestionBySlugUseCase

describe("Get Question By Slug Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        sut = new GetQuestionBySlugUseCase(questionsRepository)
    })

    it('should be able to get question by slug', async () => {
        const questionCreated = makeQuestion({
            title: "Novo Titulo"
        })

        await questionsRepository.create(questionCreated)

        const { question } = await sut.execute({ slug: "novo-titulo" })

        expect(question.slug.value).toEqual("novo-titulo")
    })

    it('should not be able to get question by inexistent slug', async () => {
         const questionCreated = makeQuestion({
            title: "Novo Titulo"
         })

        await questionsRepository.create(questionCreated)

        await expect(sut.execute({ slug: "random-slug" })).rejects.toBeInstanceOf(QuestionNotFoundError)
    })
})