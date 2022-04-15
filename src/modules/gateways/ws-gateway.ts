import { Socket, Server } from 'socket.io'
import { EventParams } from 'socket.io/dist/typed-events'

import { EventRepository } from '@modules/events/repositories'
import { FindManyEventsUseCase } from '@modules/events/use-cases'

// eslint-disable-next-line import/no-cycle
import { EventsHandler } from './handlers'
import { ServerIoData, ServerToClientEvents, SocketData, SocketIoData } from './types/socket.type'

// Repositories
const eventRepository = new EventRepository()

// UseCases
const findManyEventsUseCase = new FindManyEventsUseCase(eventRepository)

export class WsGateway {
  private static instance: WsGateway

  protected io!: ServerIoData

  protected socket!: SocketIoData

  protected activeSessions: Map<string, Partial<SocketData>> = new Map()

  private eventHandler!: EventsHandler

  public static getInstance(): WsGateway {
    if (!WsGateway.instance) {
      WsGateway.instance = new WsGateway()
    }

    return WsGateway.instance
  }

  public onConnection({ io, socket }: { io: Server; socket: Socket }) {
    this.io = io
    this.socket = socket
    this.eventHandler = new EventsHandler(io, socket, findManyEventsUseCase)

    console.log('User connected:', socket.id)
    this.activeSessions.set(socket.id, socket.data)
    this.handleIncomingEvents()
  }

  public onDisconnection() {
    console.log('User disconnected:', this.socket.id)
    this.activeSessions.delete(this.socket.id)
  }

  public publishEvent<T extends keyof ServerToClientEvents>(
    event: T,
    ...args: EventParams<ServerToClientEvents, T>
  ) {
    console.log('Event emitted:', event)
    this.io.emit(event, ...args)
  }

  private handleIncomingEvents() {
    this.socket.on('client:event:search-near', message =>
      this.eventHandler.searchCloseEvents(message)
    )
    this.socket.on('disconnect', () => this.onDisconnection())
  }
}
