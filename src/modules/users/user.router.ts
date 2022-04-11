import { FastifyInstance } from 'fastify'

import { UserRepository } from './repositories'
import { SignUpUseCase, SignUpController } from './use-cases/signup'

// Repositories
const userRepository = new UserRepository()

// Use Cases
const signUpUseCase = new SignUpUseCase(userRepository)

export const userRouter = (app: FastifyInstance) => {
  app.get('/signup', async (req, rep) => new SignUpController(signUpUseCase).handle(req, rep))
}
