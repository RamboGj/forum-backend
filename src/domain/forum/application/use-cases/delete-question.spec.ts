import { describe, expect, it } from "vitest";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { makeQuestion } from "@test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedToDeleteOtherAuthorEntity } from "@/errors/not-allowed-to-delete-other-author-entity";
import { EntityNotFoundError } from "@/errors/entity-not-found-error";

let questionsRepository: InMemoryQuestionsRepository
/* sut => system under test */
let sut: DeleteQuestionUseCase

describe("Delete Question Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        sut = new DeleteQuestionUseCase(questionsRepository)
    })

    it('should be able to delete question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await questionsRepository.create(newQuestion)

        await sut.execute({
            questionId: "question-1",
            authorId: 'author-1'
        })

        expect(questionsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete question from another author', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await questionsRepository.create(newQuestion)

        await expect(sut.execute({
            questionId: "question-1",
            authorId: 'author-99'
        })).rejects.toBeInstanceOf(NotAllowedToDeleteOtherAuthorEntity)
    })

    it('should not be able to delete inexistent question', async () => {
        await expect(sut.execute({
            questionId: "question-1",
            authorId: 'author-1'
        })).rejects.toBeInstanceOf(EntityNotFoundError)
    })
})