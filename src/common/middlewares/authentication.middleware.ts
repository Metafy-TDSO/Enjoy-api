import { isJWT } from 'class-validator'
import { preHandlerAsyncHookHandler } from 'fastify'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '@common/constants/envs'

import { User } from '@modules/users/models'

export const authenticationMiddleware: preHandlerAsyncHookHandler = async (req, rep) => {
  const { authorization: authHeader } = req.headers

  if (!authHeader) {
    return rep.status(401).send('You are not authenticated!')
  }

  const splittedHeader = authHeader.split(' ')

  if (!splittedHeader[1]) {
    return rep.status(400).send('The given token is malformed!')
  }

  const [, token] = splittedHeader

  if (!isJWT(token)) {
    return rep.status(401).send('You must give a valid token!')
  }

  try {
    const validatedToken = jwt.verify(token, JWT_SECRET, { issuer: 'metafy' })

    const { id, name, email } = validatedToken as Pick<User, 'id' | 'name' | 'email'>

    req.user = {
      id,
      name,
      email
    }

    rep.status(200).send(req.user)
  } catch (err) {
    return rep.status(400).send('You must give a valid and not expired token!')
  }
}
