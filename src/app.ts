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
    definitions: {
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'birth', 'password', 'phone'],
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Guilherme Vieira' },
          email: { type: 'string', format: 'email', example: 'example@gmail.com' },
          birth: { type: 'string', format: 'date', example: '2002-08-02' },
          password: { type: 'string', format: 'password', example: 'Guigui123##' },
          phone: { type: 'string', minLength: 11, maxLength: 10, example: '11912345678' },
          avatarUrl: { type: 'string', format: 'uri' },
          createdAt: { type: 'string', format: 'date-time', example: '2022-04-11' },
          updatedAt: { type: 'string', format: 'date-time', default: null, example: '2022-04-11' }
        }
      }
    },
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
