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
  const { authorization: authHeader } = socket.handshake.headers

  if (!authHeader) {
    console.warn('User without header')
    return next(UnauthenticatedError('You are not authenticated!'))
  }

  const splittedHeader = authHeader.split(' ')

  if (!splittedHeader[1]) {
    console.warn('Token is malformed', authHeader)
    return next(BadRequestError('The given token is malformed!'))
  }

  const [, token] = splittedHeader

  if (!isJWT(token)) {
    console.warn('Token is not a jwt', token)
    return next(UnauthenticatedError('You must give a valid token!'))
  }

  try {
    const validatedToken = jwt.verify(token, JWT_SECRET, { issuer: 'metafy' }) as JUser

    socket.data = validatedToken
    next()
  } catch (err) {
    console.warn('Token is invalid or expired', err)
    return next(BadRequestError('You must give a valid and not expired token!'))
  }
}
