import { FastifyPluginCallback } from 'fastify'

import { UserRepository } from './repositories'
import { LoginController, LoginUseCase } from './use-cases/login'
import { SignUpController, SignUpUseCase } from './use-cases/signup'

// Repositories
const userRepository = new UserRepository()

// Use Cases
const signUpUseCase = new SignUpUseCase(userRepository)
const loginUseCase = new LoginUseCase(userRepository)

export const userRouter: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/signup', async (req, rep) => new SignUpController(signUpUseCase).handle(req, rep))
  app.post('/login', async (req, rep) => new LoginController(loginUseCase).handle(req, rep))

  done()
}
