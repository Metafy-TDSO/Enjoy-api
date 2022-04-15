import { Socket, Server } from 'socket.io'
import { EventParams } from 'socket.io/dist/typed-events'

import { Location } from '@modules/events/models'
import { EventRepository } from '@modules/events/repositories'
import { FindManyEventsUseCase } from '@modules/events/use-cases'

import { EventHandlerEvents, EventsHandler } from './handlers'

// Repositories
const eventRepository = new EventRepository()

// Use Cases
const findManyEventsUseCase = new FindManyEventsUseCase(eventRepository)

type ServerToClientEvents = EventHandlerEvents

type ClientToServerEvents = EventHandlerEvents

interface SocketData extends Location {
  id: string
  name: number
  avatarUrl: string
}

export class WsGateway {
  private static instance: WsGateway

  protected io!: Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>

  protected socket!: Socket

  protected activeSessions: Set<string> = new Set()

  private readonly eventHandler: EventsHandler = new EventsHandler(
    this.io,
    this.socket,
    findManyEventsUseCase
  )

  public static getInstance(): WsGateway {
    if (!WsGateway.instance) {
      WsGateway.instance = new WsGateway()
    }

    return WsGateway.instance
  }

  public onConnection({ io, socket }: { io: Server; socket: Socket }) {
    this.io = io
    this.socket = socket

    console.log('User connected:', this.socket.id)
    this.activeSessions.add(socket.id)
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
}
