import { app } from './app'
import { PORT } from './constants/envs'

app.listen(PORT, err => {
  if (err) throw err
})
