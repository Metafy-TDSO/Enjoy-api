import { preHandlerAsyncHookHandler } from 'fastify'

export const isAccountOwnerMiddleware: preHandlerAsyncHookHandler = async (req, rep) => {
  const { idUser } = req.query as { idUser: number }

  if (!req.user) {
    return rep.status(401).send('You are not authenticated!')
  }

  const { id } = req.user

  if (id !== idUser) {
    return rep.status(403).send('You are not allowed to do this action!')
  }

  return rep.status(200).send({ authenticated: true })
}
