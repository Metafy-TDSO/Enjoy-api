import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import websocket from 'fastify-websocket'

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
app.register(websocket, {
  options: { maxPayload: 1048576 }
})

app.register(userRouter, { prefix: '/users' })
app.register(creatorRouter, { prefix: '/creator' })
app.register(eventRouter, { prefix: '/events' })
