import 'reflect-metadata'

import fastify from 'fastify'
import { IS_DEV } from './constants/envs'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import gracefullyShutDown from 'fastify-graceful-shutdown'

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
