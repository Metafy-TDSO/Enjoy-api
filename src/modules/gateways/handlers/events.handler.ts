import { Location } from '@modules/events/models'
import { FindManyEventsUseCase } from '@modules/events/use-cases'

import { ServerIoData, SocketIoData } from '../types/socket.type'

export class EventsHandler {
  constructor(
    private io: ServerIoData,
    private socket: SocketIoData,
    private readonly findManyEventsUseCase: FindManyEventsUseCase
  ) {}

  public async searchCloseEvents(location: Location) {
    const { latitude, longitude } = location

    const foundEvents = await this.findManyEventsUseCase.execute({ latitude, longitude })

    this.socket.emit('server:event:search-near', foundEvents)
  }
}
