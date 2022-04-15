import { isJWT } from 'class-validator'
import jwt from 'jsonwebtoken'
import { ExtendedError } from 'socket.io/dist/namespace'

import { JWT_SECRET } from '@common/constants/envs'
import { UnauthenticatedError, BadRequestError } from '@common/errors/http.errors'
import { JUser } from '@common/models/JUser'

import { SocketIoData } from '../types/socket.type'

export const wsAuthenticationMiddleware = (
  socket: SocketIoData,
  next: (err?: ExtendedError | undefined) => void
): void => {
  const { token: authToken } = socket.handshake.auth as { token: string }

  if (!authToken) {
    return next(UnauthenticatedError('You are not authenticated!'))
  }

  const splittedToken = authToken.split(' ')

  if (!splittedToken[1]) {
    return next(BadRequestError('The given token is malformed!'))
  }

  const [, token] = splittedToken

  if (!isJWT(token)) {
    return next(UnauthenticatedError('You must give a valid token!'))
  }

  try {
    const validatedToken = jwt.verify(token, JWT_SECRET, { issuer: 'metafy' }) as JUser

    socket.data = validatedToken
  } catch (err) {
    return next(BadRequestError('You must give a valid and not expired token!'))
  }
}
