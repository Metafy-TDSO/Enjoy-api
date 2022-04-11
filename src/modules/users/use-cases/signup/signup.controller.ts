import { plainToInstance } from 'class-transformer'
import { FastifyRequest, FastifyReply } from 'fastify'

import { SignUpDto } from '@modules/users/dtos'

import { SignUpUseCase } from './signup.use-case'

export class CreateUserController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const input = request.body as SignUpDto

    try {
      plainToInstance(SignUpDto, input)
    } catch (err) {
      return reply.status(401).send(err)
    }

    try {
      const result = await this.signUpUseCase.execute(input)

      return await reply.status(201).send(result)
    } catch (err) {
      return reply.status(400).send({
        message: (err as Error).message || 'Unexpected error.'
      })
    }
  }
}
