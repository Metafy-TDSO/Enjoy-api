import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { FastifyRequest, FastifyReply } from 'fastify'

import { HttpError } from '@common/errors/http.errors'
import { formatValidationErrors } from '@common/utils/format-errors.util'

import { CreateCreatorDto } from '@modules/users/dtos'

import { CreateCreatorUseCase } from './create-creator.use-case'

export class CreateCreatorController {
  constructor(private createCreatorUseCase: CreateCreatorUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const queries = request.params as CreateCreatorDto

    try {
      const dto = plainToInstance(CreateCreatorDto, queries)
      await validateOrReject(dto)
    } catch (err) {
      const invalidArguments = formatValidationErrors(err as ValidationError[])

      return reply.status(400).send({
        message: 'Invalid arguments provided.',
        invalidArguments
      })
    }

    try {
      const result = await this.createCreatorUseCase.execute(queries)

      return await reply.status(201).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
