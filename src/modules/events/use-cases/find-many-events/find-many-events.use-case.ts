import { EventRepository, JoinedEventCreator } from '@modules/events/repositories'

import { FindManyEventsDto } from '../../dtos'

export class FindManyEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(input: FindManyEventsDto): Promise<{ events: JoinedEventCreator[] }> {
    const { limit, page, userLatLong, idCreator, name, rating } = input

    if (userLatLong) {
      const [latitude, longitude] = userLatLong.split(' ')
      const userLocation = { latitude: Number(latitude), longitude: Number(longitude) }

      const foundEvents = await this.eventRepository.findAllEventsInRadius({
        userLocation
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
      }
    })

    return {
      events: foundEvents
    }
  }
}
