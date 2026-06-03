import { describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedToDeleteOtherAuthorEntity } from "@/errors/not-allowed-to-delete-other-author-entity";
import { EntityNotFoundError } from "@/errors/entity-not-found-error";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { makeAnswer } from "@test/factories/make-answer";

let answersRepository: InMemoryAnswersRepository
/* sut => system under test */
let sut: EditAnswerUseCase

describe("Edit Answer Use Case", () => {
    beforeEach(() => {
        answersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(answersRepository)
    })

    it('should be able to edit answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await answersRepository.create(newAnswer)

        await sut.execute({
            authorId: 'author-1',
            content: 'Novo conteudo teste',
            answerId: 'answer-1'
        })

        expect(answersRepository.items[0]).toMatchObject({
            content: 'Novo conteudo teste'
        })
    })

    it('should not be able to edit answer from another author', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await answersRepository.create(newAnswer)

        await expect(sut.execute({
            authorId: 'author-99',
            answerId: 'answer-1',
            content: 'Novo conteudo teste',
        })).rejects.toBeInstanceOf(NotAllowedToDeleteOtherAuthorEntity)
    })

    it('should not be able to edit inexistent answer', async () => {
        await expect(sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
            content: 'Novo conteudo teste',
        })).rejects.toBeInstanceOf(EntityNotFoundError)
    })
})