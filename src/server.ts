import { app } from './app'

app.listen(process.env.PORT || 3000, err => {
  if (err) throw err
})
