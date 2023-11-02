require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT

const data = fetch('https://api.github.com/user/singhsivam583').json

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter', (req, res) => {
    res.send('shivamsingh583')
})

app.get('/login', (req, res) => {
    res.send('<h1>please login at chai aur code<h1>')
})

app.get('/youtube', (req, res) => {
    res.send("chai aur code")
})

app.get('/github', (req, res) => {
  res.json(data);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
