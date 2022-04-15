import { Server, Socket } from 'socket.io'

import { Location } from '@modules/events/models'
import { JoinedEventCreator } from '@modules/events/repositories'
import { FindManyEventsUseCase } from '@modules/events/use-cases'

export interface EventHandlerEvents {
  'event:search-near': (message: Location) => void
  top: () => void
}

export class EventsHandler {
  constructor(
    private readonly io: Server,
    private readonly socket: Socket,
    private readonly findManyEventsUseCase: FindManyEventsUseCase
  ) {}

  public async searchCloseEvents(location: Location): Promise<{ events: JoinedEventCreator[] }> {
    const { latitude, longitude } = location

    return this.findManyEventsUseCase.execute({ latitude, longitude })
  }
}
