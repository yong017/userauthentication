const express = require('express')
const port = 3000
const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log('app is running on 3000')
})
