import { User } from '@modules/users/models'

declare module 'fastify' {
  interface FastifyRequest {
    user?: Pick<User, 'id' | 'name' | 'email'>
  }
}
