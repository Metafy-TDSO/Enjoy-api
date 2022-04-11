import { app } from './app'
import { PORT } from './constants/envs'

app.listen(PORT, (err, address) => {
  if (err) throw err

  app.log.info(`Server running on ${address}`)
})
