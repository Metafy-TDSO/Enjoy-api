import { plainToInstance } from 'class-transformer'
import { FastifyRequest, FastifyReply } from 'fastify'

import { SignUpDto } from '@modules/users/dtos'

import { HttpError } from 'errors/http.errors'

import { SignUpUseCase } from './signup.use-case'

export class SignUpController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const input = request.body as SignUpDto

    try {
      plainToInstance(SignUpDto, input)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Invalid Arguments provided.'
      })
    }

    try {
      const result = await this.signUpUseCase.execute(input)

      return await reply.status(201).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
