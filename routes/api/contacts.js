const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')
const { body, validationResult } = require('express-validator')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../model/index.js')

const contactsPath = path.join(__dirname, '../../model/contacts.json')

router.get('/', async (req, res, next) => {
  const contacts = await listContacts()
  res.json(contacts)
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await getContactById(req.params.contactId)
  if (contact) {
    res.json(contact)
  } else {
    res.status(404)
    res.json({ message: 'Not Found' })
  }
})

router.post('/',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').isMobilePhone(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const result = await addContact(req.body)
    console.log(result)
    try {
      await fs.writeFile(contactsPath, JSON.stringify(result))
      res.json(result)
    } catch (err) {
      res.status(400)
      res.json({ message: 'missing required name field' })
    }
  })

router.delete('/:contactId', async (req, res, next) => {
  const newContactsList = await removeContact(req.params.contactId)
  console.log(newContactsList)
  try {
    await fs.writeFile(contactsPath, JSON.stringify(newContactsList))
    res.status(200)
    res.json({ message: 'contact deleted' })
  } catch (err) {
    res.status(404)
    res.json({ message: 'Not Found' })
  }
})

router.patch('/:contactId',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').isMobilePhone(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const result = await updateContact(req.params.contactId, req.body)
    try {
      await fs.writeFile(contactsPath, JSON.stringify(result))
      res.status(200)
      res.json(result)
    } catch (err) {
      res.status(400)
      res.json({ message: 'missing fields' })
    }
  })

module.exports = router
