import { describe, expect, it } from "vitest";
import { AnswerQuestion } from "./answer-question";
import { AnswersRepository } from "../repositories/answers-repository";
import { Answer } from "../entities/answer";

const fakeAnswersRepository: AnswersRepository = {
    create: async (answer: Answer) => {
        return
    }
}

describe("Answer Question Use Case", () => {
    it('should be able to answer question', async () => {
        const answerQuestion = new AnswerQuestion(fakeAnswersRepository)

        const answer = await answerQuestion.execute({
            content: "Nova resposta",
            instructorId: "1",
            questionId: "1"
        })

        expect(answer.content).toEqual("Nova resposta")
    })
})