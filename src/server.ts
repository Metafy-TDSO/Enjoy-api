import { app } from './app'

app.listen(process.env.PORT || 3000, '0.0.0.0', err => {
  if (err) throw err
})
