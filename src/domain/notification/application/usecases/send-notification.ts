import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface SendNotificationUseCaseRequest {
  title: string
  recipientId: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    title,
    content,
    recipientId,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      title,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
