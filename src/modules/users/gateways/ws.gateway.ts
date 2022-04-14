import { FastifyRequest } from 'fastify'
import { SocketStream } from 'fastify-websocket'

export class WsGateway {
  constructor(private readonly connection: SocketStream, private request: FastifyRequest) {}

  protected userIds: Set<number> = new Set()

  execute() {
    this.onOpen()
    this.onClose()
  }

  private onOpen() {
    this.connection.socket.on('open', () => {
      const userId = this.request.user?.id

      if (userId) {
        this.userIds.add(userId)
      }
    })
  }

  private onClose() {
    this.connection.socket.on('close', () => {
      const userId = this.request.user?.id

      if (userId) {
        this.userIds.delete(userId)
      }
    })
  }
}
