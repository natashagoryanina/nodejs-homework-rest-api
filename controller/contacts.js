const service = require('../service/model/contacts.js')

const get = async (req, res, next) => {
  try {
    const results = await service.getAllContacts()
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: results,
      },
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const getById = async (req, res, next) => {
  const { id } = req.params
  try {
    const result = await service.getContactsById(id)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contacts: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Can't find contact by id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    const result = await service.createContact(req.body)

    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact: result },
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  const { name, email, phone, favorite } = req.body
  try {
    const result = await service.updateContact(id, { name, email, phone, favorite })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Can't find contact by id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const updateStatus = async (req, res, next) => {
  const { id } = req.params
  const { favorite = false } = req.body

  try {
    const result = await service.updateContact(id, { favorite })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Can't find contact by id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const remove = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await service.removeContact(id)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Can't find contact by id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
}
// const { v4: uuidv4 } = require('uuid')
// const fs = require('fs').promises
// const path = require('path')
// const contactsPath = path.join(__dirname, './contacts.json')

// const getContacts = async () => {
//   try {
//     const result = await fs.readFile(contactsPath, 'utf-8')
//     return JSON.parse(result)
//   } catch (err) {
//     throw new Error(err)
//   }
// }

// const listContacts = async () => {
//   const contacts = await getContacts()
//   return contacts
// }

// const getContactById = async (contactId) => {
//   const contacts = await getContacts()
//   const contact = await contacts.find(elem => elem.id === contactId)
//   return contact
// }

// const removeContact = async (contactId) => {
//   const contacts = await getContacts()
//   const result = await contacts.filter(elem => elem.id !== contactId)
//   return result
// }

// const addContact = async (body) => {
//   const contactsList = await getContacts()
//   const { name, email, phone } = body
//   const newContact = {
//     id: uuidv4(),
//     name,
//     email,
//     phone,
//   }
//   contactsList.push(newContact)
//   return contactsList
// }

// const updateContact = async (contactId, body) => {
//   const { name } = body
//   const contacts = await getContacts()
//   const changedContact = await contacts.find(elem => elem.id === contactId)
//   changedContact.name = name
//   const contactsList = await contacts.filter(elem => elem.id !== contactId)
//   contactsList.push(changedContact)
//   return contactsList
// }

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }
