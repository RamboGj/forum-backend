import { describe, expect, it } from "vitest";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { makeQuestion } from "@test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionCommentsRepository } from "@test/repositories/in-memory-question-comments-repository";

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe("Comment On Question Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository)
    })

    it('should be able to comment on question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await questionsRepository.create(newQuestion)

        await sut.execute({ authorId: 'author-9', content: 'comment test', questionId: 'question-1' })

        expect(questionCommentsRepository.items[0]?.content).toEqual('comment test')
    })
})