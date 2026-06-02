import { describe, expect, it } from "vitest";
import {  CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";

let questionsRepository: InMemoryQuestionsRepository
/* sut => system under test */
let sut: CreateQuestionUseCase

describe("Create Question Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        sut = new CreateQuestionUseCase(questionsRepository)
    })

    it('should be able to create a question', async () => {
        const question = await sut.execute({
            content: "Nova resposta",
            authorId: "1",
            title: "Novo titulo"
        })

        expect(question.question.title).toEqual("Novo titulo")
        expect(question.question.slug.value).toEqual("novo-titulo")
    })
})