const express = require('express')
const router = express.Router()
const {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
} = require('../../controller/contacts.js')

router.get('/', get)
router.get('/:contactId', getById)
router.post('/', create)
router.put('/:contactId', update)
router.patch('/:contactId', updateStatus)
router.delete('/:contactId', remove)

module.exports = router
