const Contacts = require('../schemas/contacts.js')

const getAllContacts = async () => {
  return Contacts.find()
}

const getContactsById = (id) => {
  return Contacts.findOne({ _id: id })
}

const createContact = (body) => {
  return Contacts.create(body)
}

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

const removeContact = (id) => {
  return Contacts.findByIdAndRemove({ _id: id })
}

module.exports = {
  getAllContacts,
  getContactsById,
  createContact,
  updateContact,
  removeContact,
}
