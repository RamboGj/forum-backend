import { describe, expect, it } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from '@test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let notificationsRepository: InMemoryNotificationsRepository
/* sut => system under test */
let sut: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    notificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(notificationsRepository.items[0]?.readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('1'),
    })

    notificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: '5',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
