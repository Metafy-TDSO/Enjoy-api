import { FastifyPluginCallback } from 'fastify'

import { authenticationMiddleware, isAccountOwnerMiddleware } from '@common/middlewares'

import { CreatorRepository, UserRepository } from './repositories'
import { CreateCreatorController, CreateCreatorUseCase } from './use-cases/create-creator'
import { LoginController, LoginUseCase } from './use-cases/login'
import { SignUpController, SignUpUseCase } from './use-cases/signup'

// Repositories
const userRepository = new UserRepository()
const creatorRepository = new CreatorRepository()

// Use Cases
const signUpUseCase = new SignUpUseCase(userRepository)
const loginUseCase = new LoginUseCase(userRepository)
const createCreatorUseCase = new CreateCreatorUseCase(userRepository, creatorRepository)

export const userRouter: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/signup', async (req, rep) => new SignUpController(signUpUseCase).handle(req, rep))
  app.post('/login', async (req, rep) => new LoginController(loginUseCase).handle(req, rep))

  app.post(
    '/:idUser/creator',
    { preHandler: [authenticationMiddleware, isAccountOwnerMiddleware] },
    async (req, rep) => new CreateCreatorController(createCreatorUseCase).handle(req, rep)
  )

  done()
}
