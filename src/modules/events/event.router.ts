import { FastifyPluginCallback } from 'fastify'

import { authenticationMiddleware } from '@common/middlewares'

import { CreatorRepository } from '@modules/users/repositories'

import { EventRepository } from './repositories'
import { CreateEventController, CreateEventUseCase } from './use-cases'

// Repositories
const eventRepository = new EventRepository()
const creatorRepository = new CreatorRepository()

// Use Cases
const createEventUseCase = new CreateEventUseCase(eventRepository, creatorRepository)

export const eventRouter: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/', { preHandler: [authenticationMiddleware] }, (req, rep) =>
    new CreateEventController(createEventUseCase).handle(req, rep)
  )
  app.get('/', (req, rep) => new CreateEventController(createEventUseCase).handle(req, rep))

  done()
}
