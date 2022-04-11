import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { FastifyRequest, FastifyReply } from 'fastify'

import { HttpError } from '@common/errors/http.errors'
import { formatValidationErrors } from '@common/utils/format-errors.util'

import { SignUpDto } from '@modules/users/dtos'

import { SignUpUseCase } from './signup.use-case'

export class SignUpController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const input = request.body as SignUpDto

    try {
      const dto = plainToInstance(SignUpDto, input)
      await validateOrReject(dto)
    } catch (err) {
      const invalidArguments = formatValidationErrors(err as ValidationError[])

      return reply.status(400).send({
        message: 'Invalid arguments provided.',
        invalidArguments
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
