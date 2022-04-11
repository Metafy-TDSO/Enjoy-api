import { app } from './app'
import { PORT } from './constants/envs'

app.after(() => {
  app.gracefulShutdown((_signal, next) => {
    console.warn('Closing the app...')
    next()
  })
})

app.listen(PORT, (err, address) => {
  if (err) throw err

  console.info(`Server running on ${address}`)
})
