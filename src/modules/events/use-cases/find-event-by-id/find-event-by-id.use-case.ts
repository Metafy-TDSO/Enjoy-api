import { EventRepository, JoinedEventCreator } from '@modules/events/repositories'

export class FindEventByIdUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: number): Promise<{ event: JoinedEventCreator | null }> {
    const foundEvent = await this.eventRepository.findById(id)

    return {
      event: foundEvent
    }
  }
}
