import { describe, expect, it } from "vitest";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { makeQuestion } from "@test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { EditQuestionUseCase } from "./edit-question";

let questionsRepository: InMemoryQuestionsRepository
/* sut => system under test */
let sut: EditQuestionUseCase

describe("Edit Question Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(questionsRepository)
    })

    it('should be able to edit question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await questionsRepository.create(newQuestion)

        await sut.execute({
            questionId: newQuestion.id.toString(),
            authorId: 'author-1',
            content: 'Novo conteudo teste',
            title: "Novo titulo teste"
        })

        expect(questionsRepository.items[0]).toMatchObject({
            title: "Novo titulo teste",
            content: 'Novo conteudo teste'
        })
    })

    it('should not be able to edit question from another author', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await questionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: "question-1",
            authorId: 'author-99',
            content: 'Novo conteudo teste',
            title: "Novo titulo teste"
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to edit inexistent question', async () => {
        const result = await sut.execute({
            questionId: "question-1",
            authorId: 'author-1',
            content: 'Novo conteudo teste',
            title: "Novo titulo teste"
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})