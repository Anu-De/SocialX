const express = require('express')
const path = require('path')
const app = express()
const port = 3000

// app.use(express.static('client/src/css'))
// app.use(express.static(path.join(__dirname, 'client', 'public')))
app.use(express.static(path.join(__dirname, 'client', 'src')))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client','public', 'login-form.html'))
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})