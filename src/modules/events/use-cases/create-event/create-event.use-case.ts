import { NotFoundError } from '@common/errors/http.errors'

import { Event } from '@modules/events/models'
import { EventRepository } from '@modules/events/repositories'
import { CreatorRepository } from '@modules/users/repositories'

import { CreateEventDto } from '../../dtos'

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly creatorRepository: CreatorRepository
  ) {}

  async execute(input: CreateEventDto): Promise<{ event: Event }> {
    const { idCreator, ...eventInput } = input

    const creatorExists = await this.creatorRepository.exists({ id: Number(idCreator) })

    if (!creatorExists) {
      throw NotFoundError(`This creator doesn't exist.`)
    }

    const createdEvent = await this.eventRepository.save({
      idCreator: Number(idCreator),
      ...eventInput
    })

    if (!createdEvent) {
      throw NotFoundError(`Couldn't create a event.`)
    }

    return {
      event: createdEvent
    }
  }
}
