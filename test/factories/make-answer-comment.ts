import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

import { faker } from '@faker-js/faker'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const questionComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID('1'),
      content: faker.lorem.text(),
      answerId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )

  return questionComment
}
