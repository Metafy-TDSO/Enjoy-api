import { plainToInstance } from 'class-transformer'
import { FastifyRequest, FastifyReply } from 'fastify'

import { LoginDto } from '@modules/users/dtos'

import { HttpError } from '@errors/http.errors'

import { LoginUseCase } from './login.use-case'

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const input = request.body as LoginDto

    try {
      plainToInstance(LoginDto, input)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Invalid Arguments provided.'
      })
    }

    try {
      const result = await this.loginUseCase.execute(input)

      return await reply.status(200).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
