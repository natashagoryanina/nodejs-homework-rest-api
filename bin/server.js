const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()

const contactsRouter = require('../routes/api/contacts')

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

const PORT = process.env.PORT || 3005
const DB = process.env.DB_HOST

mongoose.Promise = global.Promise

const connection = mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`),
  )
