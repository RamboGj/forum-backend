import { describe, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@test/factories/make-answer'
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

/* sut => system under test */
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      answersRepository,
      questionsRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    const newAnswer = makeAnswer(
      {
        questionId: newQuestion.id,
      },
      new UniqueEntityID('answer-1'),
    )

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    })

    expect(questionsRepository.items[0]?.bestAnswerId).toEqual(newAnswer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    const newAnswer = makeAnswer(
      {
        questionId: newQuestion.id,
      },
      new UniqueEntityID('answer-1'),
    )

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
