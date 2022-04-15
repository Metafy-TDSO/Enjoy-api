import { Server, Socket } from 'socket.io'

import { JUser } from '@common/models'

import { Location } from '@modules/events/models'
import { JoinedEventCreator } from '@modules/events/repositories'

export interface ServerToClientEvents {
  'server:event:search-near': (parameters: { events: JoinedEventCreator[] }) => void
}

export interface ClientToServerEvents {
  'client:event:search-near': (message: Location) => void
}

export type SocketData = JUser

export type ServerIoData = Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>
export type SocketIoData = Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>
