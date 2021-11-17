const { v4: uuidv4 } = require('uuid')
const fs = require('fs').promises
const path = require('path')
const contactsPath = path.join(__dirname, './contacts.json')

const getContacts = async () => {
  try {
    const result = await fs.readFile(contactsPath, 'utf-8')
    return JSON.parse(result)
  } catch (err) {
    throw new Error(err)
  }
}

const listContacts = async () => {
  const contacts = await getContacts()
  return contacts
}

const getContactById = async (contactId) => {
  const contacts = await getContacts()
  const contact = await contacts.find(elem => elem.id === contactId)
  return contact
}

const removeContact = async (contactId) => {
  const contacts = await getContacts()
  const result = await contacts.filter(elem => elem.id !== contactId)
  return result
}

const addContact = async (body) => {
  const contactsList = await getContacts()
  const { name, email, phone } = body
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  }
  contactsList.push(newContact)
  return contactsList
}

const updateContact = async (contactId, body) => {
  const { name } = body
  const contacts = await getContacts()
  const changedContact = await contacts.find(elem => elem.id === contactId)
  changedContact.name = name
  const contactsList = await contacts.filter(elem => elem.id !== contactId)
  contactsList.push(changedContact)
  return contactsList
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
