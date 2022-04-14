import { FastifyPluginCallback } from 'fastify'

import { authenticationMiddleware } from '@common/middlewares'

import { EventRepository } from '@modules/events/repositories'
import { CreateEventUseCase, CreateEventController } from '@modules/events/use-cases'
import { CreatorRepository } from '@modules/users/repositories'

// Repositories
const eventRepository = new EventRepository()
const creatorRepository = new CreatorRepository()

// Use Cases
const createEventUseCase = new CreateEventUseCase(eventRepository, creatorRepository)

export const creatorRouter: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/:idCreator/event', { preHandler: [authenticationMiddleware] }, async (req, rep) =>
    new CreateEventController(createEventUseCase).handle(req, rep)
  )

  done()
}
