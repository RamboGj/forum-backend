import { describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { makeAnswer } from "@test/factories/make-answer";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let answersRepository: InMemoryAnswersRepository
/* sut => system under test */
let sut: DeleteAnswerUseCase

describe("Delete Answer Use Case", () => {
    beforeEach(() => {
        answersRepository = new InMemoryAnswersRepository()
        sut = new DeleteAnswerUseCase(answersRepository)
    })

    it('should be able to delete answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1'),
            questionId: new UniqueEntityID('question-1'),
        }, new UniqueEntityID('answer-1'))

        await answersRepository.create(newAnswer)

        await sut.execute({
            answerId: "answer-1",
            authorId: "author-1"
        })

        expect(answersRepository.items).toHaveLength(0)
    })

    it('should not be able to delete answer from another author', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await answersRepository.create(newAnswer)

        const result = await sut.execute({
            authorId: 'author-99',
            answerId: 'answer-1'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to delete inexistent answer', async () => {
        const result = await sut.execute({
            answerId: "random-answer-99",
            authorId: 'author-1',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})