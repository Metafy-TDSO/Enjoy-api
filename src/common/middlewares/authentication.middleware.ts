import { isJWT } from 'class-validator'
import { preHandlerAsyncHookHandler } from 'fastify'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '@common/constants/envs'

import { User } from '@modules/users/models'

export const authenticationMiddleware: preHandlerAsyncHookHandler = async (req, rep) => {
  const { authorization: authHeader } = req.headers

  if (!authHeader) {
    req.log.warn('User without header')
    return rep.status(401).send({ message: 'You are not authenticated!' })
  }

  const splittedHeader = authHeader.split(' ')

  if (!splittedHeader[1]) {
    req.log.warn(`User doesn't provided the token, just the prefix`)
    return rep.status(400).send({ message: 'The given token is malformed!' })
  }

  const [, token] = splittedHeader

  if (!isJWT(token)) {
    req.log.warn(`User didn't give a valid token`)
    return rep.status(401).send({ message: 'You must give a valid token!' })
  }

  try {
    const validatedToken = jwt.verify(token, JWT_SECRET, { issuer: 'metafy' })

    const { id, name, email } = validatedToken as Pick<User, 'id' | 'name' | 'email'>
    req.log.info({ validatedToken }, 'Validated token')

    req.user = {
      id,
      name,
      email
    }
  } catch (err) {
    req.log.error({ error: (err as Error).message }, 'Token invalid')
    return rep.status(400).send({ message: 'You must give a valid and not expired token!' })
  }
}
