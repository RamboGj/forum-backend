import { describe, expect, it } from "vitest";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { makeQuestion } from "@test/factories/make-question";
import { ListRecentQuestionsUseCase } from "./list-recent-questions";

let questionsRepository: InMemoryQuestionsRepository
let sut: ListRecentQuestionsUseCase

describe("List Recent Questions Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        sut = new ListRecentQuestionsUseCase(questionsRepository)
    })

    it('should be able to list recent questions', async () => {
        await questionsRepository.create(makeQuestion({
            createdAt: new Date(2026, 0, 18)
        }))
        await questionsRepository.create(makeQuestion({
            createdAt: new Date(2026, 0, 19)
        }))
        await questionsRepository.create(makeQuestion({
            createdAt: new Date(2026, 0, 20)
        }))

        const result = await sut.execute({ page: 1 })

        expect(result.isRight()).toBe(true)
        expect(result.value?.questions).toEqual([
            expect.objectContaining({
                createdAt: new Date(2026, 0, 20)
            }),
            expect.objectContaining({
                createdAt: new Date(2026, 0, 19)
            }),
            expect.objectContaining({
                createdAt: new Date(2026, 0, 18)
            })
        ])
    })

    it('should be able to list paginated recent questions', async () => {
        for (let i = 0; i <= 22; i++) {
            await questionsRepository.create(makeQuestion())
        }

        const result = await sut.execute({ page: 2 })

        expect(result.isRight()).toBe(true)
        expect(result.value?.questions).toHaveLength(3)
    })
})