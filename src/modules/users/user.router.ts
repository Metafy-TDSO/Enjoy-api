import { FastifyInstance } from 'fastify'

import { UserRepository } from './repositories'
import { LoginController, LoginUseCase } from './use-cases/login'
import { SignUpController, SignUpUseCase } from './use-cases/signup'

// Repositories
const userRepository = new UserRepository()

// Use Cases
const signUpUseCase = new SignUpUseCase(userRepository)
const loginUseCase = new LoginUseCase(userRepository)

export const userRouter = (app: FastifyInstance) => {
  app.addSchema({
    $id: 'User',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', example: 'Guilherme Vieira' },
      email: { type: 'string', format: 'email', example: 'example@gmail.com' },
      birth: { type: 'string', format: 'date', example: '2002-08-02' },
      phone: { type: 'string', minLength: 11, maxLength: 10, example: '11912345678' },
      avatarUrl: { type: 'string', format: 'uri' },
      createdAt: { type: 'string', format: 'date-time', example: '2022-04-11' },
      updatedAt: { type: 'string', format: 'date-time', default: null, example: '2022-04-11' }
    },
    required: ['id', 'name', 'email', 'birth', 'phone']
  })

  app.post(
    '/signup',
    {
      schema: {
        response: {
          201: {
            description: 'Successful signup',
            type: 'object',
            properties: {
              user: {
                $ref: 'User#'
              },
              token: { type: 'string' }
            }
          },
          400: {
            type: 'string',
            $ref: '#Error'
          }
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Guilherme Vieira' },
            email: { type: 'string', format: 'email', example: 'example@gmail.com' },
            birth: { type: 'string', format: 'date', example: '2002-08-02' },
            password: { type: 'string', format: 'password', example: 'Guigui123##' },
            confirmPassword: { type: 'string', format: 'password', example: 'Guigui123##' },
            phone: { type: 'string', minLength: 11, maxLength: 10, example: '11912345678' },
            avatarUrl: { type: 'string', format: 'uri' }
          },
          required: ['name', 'email', 'birth', 'password', 'confirmPasssword', 'phone']
        }
      }
    },
    async (req, rep) => new SignUpController(signUpUseCase).handle(req, rep)
  )

  app.post(
    '/login',
    {
      schema: {
        response: {
          201: {
            description: 'Successful signup',
            type: 'object',
            properties: {
              user: {
                $ref: 'User#'
              },
              token: { type: 'string' }
            }
          },
          400: {
            type: 'string',
            description: 'Wrong Password.',
            $ref: '#Error'
          },
          404: {
            type: 'string',
            description: 'User not found.',
            $ref: '#Error'
          }
        },
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'example@gmail.com' },
            password: { type: 'string', format: 'password', example: 'Guigui123##' }
          },
          required: ['email', 'password']
        }
      }
    },
    async (req, rep) => new LoginController(loginUseCase).handle(req, rep)
  )
}
