const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const gravatar = require('gravatar')
const Jimp = require('jimp')
const fs = require('fs').promises
const multer = require('multer')
const path = require('path')
const User = require('../../service/schemas/user.js')
require('dotenv').config()
const secret = process.env.SECRET

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Incorrect login or password',
      data: 'Bad request',
    })
  }

  const payload = {
    id: user.id,
    username: user.username,
  }

  const token = jwt.sign(payload, secret, { expiresIn: '1h' })

  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
    },
  })
})

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'User with this email already exists',
      data: 'Conflict',
    })
  }
  try {
    const avatarURL = gravatar.url(email, { protocol: 'https', s: '100' })
    const newUser = new User({ username, email, avatarURL })
    newUser.setPassword(password)
    await newUser.save()
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        message: 'Registration is successful',
        user: newUser
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/list', auth, (req, res, next) => {
  const { username } = req.user
  console.log(req.user)
  res.json({
    status: 'success',
    code: 200,
    data: {
      message: `Authorization was successful ${username}`,
    },
  })
})

router.get('/logout', auth, async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)
  console.log(user)
  if (user) {
    User.findByIdAndUpdate(_id, { token: null })
    res.status(204).json({
      status: 'success',
      code: 204
    })
  } else {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      data: 'Unauthorized',
    })
  }
})

router.post('/current', auth, async (req, res, next) => {
  const { email, subscription } = req.user
  res.json({
    status: 'success',
    code: 200,
    data: {
      email: email,
      subscription: subscription
    },
  })
})

router.patch('/', auth, async (req, res, next) => {
  const { subscription } = req.body
  console.log(req.body)
  const { _id } = req.user
  const user = await User.findById(_id)
  console.log(user)
  if (user) {
    const result = await User.findByIdAndUpdate(_id, { subscription: subscription })
    res.json({
      status: 'success',
      code: 200,
      data: { user: result }
    })
  } else {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      data: 'Unauthorized',
    })
  }
})

const uploadDir = path.join(process.cwd(), 'public/tmp')
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

router.patch('/avatars', upload.single('avatar'), auth, async (req, res, next) => {
  const { path: temporaryName, originalname } = req.file
  Jimp.read(temporaryName)
    .then(avatar => {
      return avatar
        .resize(250, 250)
        .quality(60)
        .greyscale()
        .write(temporaryName)
    })
    .catch(err => {
      console.error(err)
    })
  const fileName = path.join(storeImage, originalname)
  try {
    await fs.rename(temporaryName, fileName)
  } catch (err) {
    await fs.unlink(temporaryName)
    return next(err)
  }
  const { _id } = req.user
  const user = await User.findById(_id)

  if (user) {
    const result = await User.findByIdAndUpdate(_id, { avatarURL: fileName })
    res.json({
      status: 'success',
      code: 200,
      data: { user: result }
    })
  } else {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      data: 'Unauthorized',
    })
  }
})

// module.exports = { router, auth }
module.exports = router
