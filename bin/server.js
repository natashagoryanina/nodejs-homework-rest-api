const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs').promises

const app = express()
//!
const uploadDir = path.join(process.cwd(), 'public/uploads')
const storeImage = path.join(process.cwd(), 'public/avatars')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  limits: {
    fileSize: 1024 * 1024,
  },
})

const upload = multer({
  storage: storage,
})

app.post('/upload', upload.single('picture'), async (req, res, next) => {
  const { description } = req.body
  const { path: temporaryName, originalname } = req.file
  const fileName = path.join(storeImage, originalname)
  try {
    await fs.rename(temporaryName, fileName)
  } catch (err) {
    await fs.unlink(temporaryName)
    return next(err)
  }
  res.json({ description, message: 'File uploaded successfully', status: 200 })
})

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder)
  }
}
//!
app.use(express.static(path.join(__dirname, '../public')))

require('dotenv').config()
app.use(express.json())
app.use(cors())

require('../config/config-passport')

const contactsRouter = require('../routes/api/contacts')
app.use('/api/contacts', contactsRouter)
const router = require('../routes/api/user')
app.use('/api/users', router)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

const PORT = process.env.PORT || 3009
const DB = process.env.DB_HOST

mongoose.Promise = global.Promise
const connection = mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//!
// app.listen(PORT, async () => {
//   createFolderIsNotExist(uploadDir)
//   createFolderIsNotExist(storeImage)
//   console.log(`Server running. Use on port:${PORT}`)
// })
//!
connection
  .then(() => {
    app.listen(PORT, function () {
      createFolderIsNotExist(uploadDir)
      createFolderIsNotExist(storeImage)
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`),
  )
