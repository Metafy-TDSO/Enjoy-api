import { FastifyRequest, FastifyReply } from 'fastify'

import { HttpError } from '@common/errors/http.errors'

import { FindEventByIdUseCase } from './find-event-by-id.use-case'

export class FindEventByIdController {
  constructor(private findEventByIdUseCase: FindEventByIdUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = request.params as { id: string }

    if (!id) {
      return reply.status(400).send({ message: 'Missing id' })
    }

    try {
      const result = await this.findEventByIdUseCase.execute(+id)

      return await reply.status(200).send(result)
    } catch (err) {
      const { code, message } = err as HttpError

      return reply.status(code ?? 400).send({
        message: message || 'Unexpected error.'
      })
    }
  }
}
