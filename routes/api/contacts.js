const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../model/index.js')

const contactsPath = path.join(__dirname, '../../module/contacts.json')

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

router.post('/', async (req, res, next) => {
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
    res.json({ message: 'Not found' })
  }
})

router.patch('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const { name } = req.body
  const contacts = await getContacts()
  const changedContact = await contacts.find(elem => elem.id === contactId)
  changedContact.name = name
  console.log(changedContact)
  const contactsList = await contacts.filter(elem => elem.id !== contactId)
  contactsList.push(changedContact)
  console.log(contactsList)
  try {
    await fs.writeFile(contactsPath, contactsList)
    res.status(200)
    res.json(contactsList)
  } catch (err) {
    res.status(400)
    res.json({ message: 'missing fields' })
  }
})

module.exports = router
