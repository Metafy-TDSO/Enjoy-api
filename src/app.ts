import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import socketio from 'fastify-socket.io'

import { WsGateway } from '@modules/gateways'
import { wsAuthenticationMiddleware } from '@modules/gateways/middlewares'

import { IS_PROD } from './common/constants/envs'
import { creatorRouter } from './modules/creators'
import { eventRouter } from './modules/events'
import { userRouter } from './modules/users'

export const app = fastify({
  logger: {
    prettyPrint: !IS_PROD
      ? {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      : false
  }
})

app.register(cors, { allowedHeaders: '*' })
app.register(helmet)
app.register(socketio, { cors: { allowedHeaders: '*' } })

app.register(userRouter, { prefix: '/users' })
app.register(creatorRouter, { prefix: '/creator' })
app.register(eventRouter, { prefix: '/events' })

app.ready().then(() => {
  const gateway = WsGateway.getInstance()
  app.io.use(wsAuthenticationMiddleware)
  app.io.on('connection', socket => gateway.onConnection({ io: app.io, socket }))
})
