import { describe, expect, it } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
/* sut => system under test */
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'Nova resposta',
      recipientId: 'notificaiton-1',
      title: 'Novo titulo',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
