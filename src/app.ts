import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import gracefullyShutDown from 'fastify-graceful-shutdown'
import helmet from 'fastify-helmet'

import { IS_DEV } from './constants/envs'

export const app = fastify({
  logger: {
    prettyPrint: IS_DEV
      ? {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      : false
  }
})

app.register(cors, { allowedHeaders: '*' })
app.register(helmet)
app.register(gracefullyShutDown)
