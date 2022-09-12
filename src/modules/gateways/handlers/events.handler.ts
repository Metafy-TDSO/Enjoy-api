import { Location } from '@modules/events/models'
import { FindManyEventsUseCase } from '@modules/events/use-cases'

import { ServerIoData, SocketIoData } from '../types/socket.type'

export class EventsHandler {
  constructor(
    private readonly io: ServerIoData,
    private readonly socket: SocketIoData,
    private readonly findManyEventsUseCase: FindManyEventsUseCase
  ) {}

  public async searchCloseEvents(location: Location) {
    const { latitude, longitude } = location

    const foundEvents = await this.findManyEventsUseCase.execute({
      latitude,
      longitude,
      limit: 20,
      page: 1,
      kilometers: 10000
    })

    this.socket.emit('server:event:search-near', foundEvents)
  }
}
