import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { differenceInHours } from 'date-fns'
import { FastifyRequest, FastifyReply } from 'fastify'

import { HttpError } from '@common/errors/http.errors'
import { formatValidationErrors } from '@common/utils/format-errors.util'

import { CreateEventDto } from '@modules/events/dtos'

import { CreateEventUseCase } from './create-event.use-case'

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { idCreator } = request.params as Pick<CreateEventDto, 'idCreator'>
    const { startAt, endsAt, ...eventInput } = request.body as Omit<CreateEventDto, 'idCreator'>

    try {
      const dto = plainToInstance(CreateEventDto, { idCreator, startAt, endsAt, ...eventInput })
      await validateOrReject(dto)
    } catch (err) {
      const invalidArguments = formatValidationErrors(err as ValidationError[])

      return reply.status(400).send({
        message: 'Invalid arguments provided.',
        invalidArguments
      })
    }

    const now = new Date()
    const startDate = new Date(startAt)
    const endDate = new Date(endsAt)

    if (differenceInHours(now, new Date(startDate)) > 0) {
      return reply.status(400).send({
        message: 'You cannot select a date from the past'
      })
    }

    if (differenceInHours(endDate, startDate) < 1) {
      return reply.status(400).send({
        message: 'The event needs to have at least 1 hour of duration'
      })
    }

    try {
      const result = await this.createEventUseCase.execute({
        idCreator,
        startAt,
        endsAt,
        ...eventInput
      })

      return await reply.status(201).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
