import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { FastifyRequest, FastifyReply } from 'fastify'

import { HttpError } from '@common/errors/http.errors'
import { formatValidationErrors } from '@common/utils/format-errors.util'

import { CreateEventDto } from '@modules/events/dtos'

import { CreateEventUseCase } from './create-event.use-case'

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { idCreator } = request.params as Pick<CreateEventDto, 'idCreator'>
    const input = request.body as Omit<CreateEventDto, 'idCreator'>

    try {
      const dto = plainToInstance(CreateEventDto, { idCreator, ...input })
      await validateOrReject(dto)
    } catch (err) {
      const invalidArguments = formatValidationErrors(err as ValidationError[])

      return reply.status(400).send({
        message: 'Invalid arguments provided.',
        invalidArguments
      })
    }

    try {
      const result = await this.createEventUseCase.execute({ idCreator, ...input })

      return await reply.status(201).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
