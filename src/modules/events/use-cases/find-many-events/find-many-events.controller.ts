import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { FastifyRequest, FastifyReply } from 'fastify'

import { HttpError } from '@common/errors/http.errors'
import { formatValidationErrors } from '@common/utils/format-errors.util'

import { FindManyEventsDto } from '@modules/events/dtos'

import { FindManyEventsUseCase } from './find-many-events.use-case'

export class FindManyEventsController {
  constructor(private findManyEventsUseCase: FindManyEventsUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { name, ...otherFields } = request.query as Record<keyof FindManyEventsDto, string>

    const convertedProperties = Object.fromEntries(
      Object.entries(otherFields).map(([key, value]) => [key, +value])
    )

    try {
      const dto = plainToInstance(FindManyEventsDto, { name, ...convertedProperties })
      await validateOrReject(dto)
    } catch (err) {
      const invalidArguments = formatValidationErrors(err as ValidationError[])

      return reply.status(400).send({
        message: 'Invalid arguments provided.',
        invalidArguments
      })
    }

    try {
      const result = await this.findManyEventsUseCase.execute({
        name,
        ...convertedProperties
      })

      return await reply.status(200).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
