import { app } from './app'
import { PORT } from './common/constants/envs'

app.listen(PORT, err => {
  if (err) throw err
})
