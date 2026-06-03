import { describe, expect, it } from "vitest";
import { ListQuestionAnswersUseCase } from "./list-question-answers";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { makeAnswer } from "@test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let answersRepository: InMemoryAnswersRepository
let sut: ListQuestionAnswersUseCase

describe("List Question Answers Use Case", () => {
    beforeEach(() => {
        answersRepository = new InMemoryAnswersRepository()
        sut = new ListQuestionAnswersUseCase(answersRepository)
    })

    it('should be able to list question answers', async () => {
        await answersRepository.create(makeAnswer({
            questionId: new UniqueEntityID('question-1')
        }))
        await answersRepository.create(makeAnswer({
            questionId: new UniqueEntityID('question-1')
        }))
        await answersRepository.create(makeAnswer({
            questionId: new UniqueEntityID('question-1')
        }))

        const { answers } = await sut.execute({ questionId: 'question-1', page: 1 })

        expect(answers).toHaveLength(3)
    })

    it('should be able to list paginated question answers', async () => {
        for (let i = 0; i <= 22; i++) {
            await answersRepository.create(makeAnswer({
                questionId: new UniqueEntityID('question-1')
            }))
        }

        const { answers } = await sut.execute({ questionId: "question-1", page: 2 })

        expect(answers).toHaveLength(3)
    })
})