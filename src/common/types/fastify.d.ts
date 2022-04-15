import { JUser } from '@common/models/JUser'

declare module 'fastify' {
  interface FastifyRequest {
    user?: JUser
  }
}
