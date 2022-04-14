import { Socket, Server } from 'socket.io'

import { EventsHandler } from './handlers'

export class WsGateway {
  private static instance: WsGateway

  private io!: Server

  private socket!: Socket

  private eventHandler: EventsHandler = new EventsHandler()

  protected activeSessions: Set<string> = new Set()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

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
}
