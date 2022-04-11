import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import gracefullyShutDown from 'fastify-graceful-shutdown'
import helmet from 'fastify-helmet'
import swagger from 'fastify-swagger'

import { userRouter } from '@modules/users'

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
app.register(swagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Documentação da API de Eventos',
      description: 'Testando a API',
      version: '1.0.0'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'users', description: 'Endpoints relacionados aos Usuários' },
      { name: 'events', description: 'Endpoints relacionados aos Eventos' },
      { name: 'creators', description: 'Endpoints relacionados aos Criadores de Eventos' }
    ],
    securityDefinitions: {
      token: {
        type: 'apiKey',
        name: 'bearer',
        in: 'header',
        description: 'Token de segurança gerado ao fazer login'
      }
    }
  },
  staticCSP: true,
  exposeRoute: true
})

app.addSchema({
  $id: 'Error',
  type: 'string'
})

app.register(userRouter, { prefix: '/users' })
