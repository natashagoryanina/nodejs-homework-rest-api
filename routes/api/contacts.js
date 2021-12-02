const express = require('express')
const router = express.Router()
const {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
  // listContactsController
} = require('../../controller/contacts.js')
// const { auth } = require('./user.js')

router.get('/', get)
// router.get('/', getFave)
router.get('/:contactId', getById)
router.post('/', create)
router.put('/:contactId', update)
router.patch('/:contactId', updateStatus)
router.delete('/:contactId', remove)
// router.get('/', auth, listContactsController)

module.exports = router
