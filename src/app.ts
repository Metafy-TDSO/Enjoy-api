import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'

import { IS_PROD } from './common/constants/envs'
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

app.register(userRouter, { prefix: '/users' })
