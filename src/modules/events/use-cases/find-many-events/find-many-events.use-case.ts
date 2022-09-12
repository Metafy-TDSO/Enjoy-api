import { Event } from '@modules/events/models'
import { EventRepository, JoinedEventCreator } from '@modules/events/repositories'

import { FindManyEventsDto } from '../../dtos'

export class FindManyEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(
    input: FindManyEventsDto,
    select?: Record<keyof Event, boolean>
  ): Promise<{ events: JoinedEventCreator[] }> {
    const {
      limit = 50,
      page = 1,
      kilometers = 20,
      latitude,
      longitude,
      idCreator,
      name,
      rating
    } = input

    if (latitude && longitude) {
      const foundEvents = await this.eventRepository.findAllEventsInRadius({
        userLocation: { latitude, longitude },
        kilometers,
        select,
        limit,
        page
      })

      return {
        events: foundEvents
      }
    }

    const foundEvents = await this.eventRepository.findAll({
      limit,
      page,
      where: {
        name: name && { contains: name },
        idCreator,
        rating: rating && { gte: rating }
      },
      select
    })

    return {
      events: foundEvents
    }
  }
}
