import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { FastifyRequest, FastifyReply } from 'fastify'

import { LoginDto } from '@modules/users/dtos'

import { HttpError } from '@errors/http.errors'
import { formatValidationErrors } from 'utils/format-errors.util'

import { LoginUseCase } from './login.use-case'

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const input = request.body as LoginDto

    try {
      const dto = plainToInstance(LoginDto, input)
      await validateOrReject(dto)
    } catch (err) {
      const errors = formatValidationErrors(err as ValidationError[])

      return reply.status(400).send({
        message: 'Invalid Arguments provided.',
        errors
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
