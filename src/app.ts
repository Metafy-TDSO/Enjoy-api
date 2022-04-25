import 'reflect-metadata'

import path from 'path'

import fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import socketio from 'fastify-socket.io'
import fastifySwagger from 'fastify-swagger'
import './public/documentation.json'
import './public/postman2.json'

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

app.register(cors, { allowedHeaders: '*', credentials: false, origin: '*', strictPreflight: false })
app.register(socketio, { cors: { allowedHeaders: '*' } })
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
    }
  }
})

app.get('/', (_req, rep) => {
  rep.status(200).send({ ok: true })
})
app.register(fastifySwagger, {
  routePrefix: '/documentation',
  mode: 'static',
  specification: {
    path: path.join(__dirname, 'public', 'documentation.json'),
    baseDir: path.join(__dirname, 'public')
  },
  exposeRoute: true
})

app.register(userRouter, { prefix: '/users' })
app.register(creatorRouter, { prefix: '/creator' })
app.register(eventRouter, { prefix: '/events' })

app.ready().then(() => {
  const gateway = WsGateway.getInstance()
  app.io.use(wsAuthenticationMiddleware)
  app.io.on('connection', socket => gateway.onConnection({ io: app.io, socket }))
})
