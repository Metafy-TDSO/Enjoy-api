import { FastifyPluginCallback } from 'fastify'

import { authenticationMiddleware } from '@common/middlewares'

import { CreatorRepository } from '@modules/users/repositories'

import { EventRepository } from './repositories'
import {
  CreateEventController,
  CreateEventUseCase,
  FindManyEventsController,
  FindManyEventsUseCase,
  FindEventByIdController,
  FindEventByIdUseCase
} from './use-cases'

// Repositories
const eventRepository = new EventRepository()
const creatorRepository = new CreatorRepository()

// Use Cases
const createEventUseCase = new CreateEventUseCase(eventRepository, creatorRepository)
const findManyEventsUseCase = new FindManyEventsUseCase(eventRepository)
const findEventByIdUseCase = new FindEventByIdUseCase(eventRepository)

export const eventRouter: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/:idCreator', { preHandler: [authenticationMiddleware] }, (req, rep) =>
    new CreateEventController(createEventUseCase).handle(req, rep)
  )
  app.get('/', (req, rep) => new FindManyEventsController(findManyEventsUseCase).handle(req, rep))
  app.get('/:id', (req, rep) => new FindEventByIdController(findEventByIdUseCase).handle(req, rep))

  done()
}
