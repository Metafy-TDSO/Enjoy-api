import { preHandlerAsyncHookHandler } from 'fastify'

export const isAccountOwnerMiddleware: preHandlerAsyncHookHandler = async (req, rep) => {
  const { idUser } = req.query as { idUser: number }

  if (!req.user) {
    req.log.warn({ user: req.user }, 'User not authenticated')
    return rep.status(401).send('You are not authenticated!')
  }

  const { id } = req.user

  if (id !== idUser) {
    req.log.warn(
      {
        id,
        idUser
      },
      'User is not the account owner'
    )
    return rep.status(403).send('You are not allowed to do this action!')
  }
}
