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

const getFavoriteContacts = async (favorite) => {
  return Contacts.find({ favorite })
}

const listContacts = async (userId, query) => {
  const { limit = 20, page = 1, totalPages = 1, sortBy, sortByDesc, filter, favorite } = query
  if (favorite) {
    return Contacts.find({ favorite })
  } else {
    const {
      docs: contacts,
      totalDocs: total,
      totalPages: Pages,
    } = await Contacts.paginate(
      { owner: userId },
      {
        limit,
        page,
        totalPages,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {})
        },
        select: filter ? filter.split('|').join(' ') : '',
        populate: { path: 'owner', select: 'email subscription -_id' },
      },
    )
    return { total, limit: +limit, page: +page, Pages, contacts }
  }
}

module.exports = {
  getAllContacts,
  getContactsById,
  createContact,
  updateContact,
  removeContact,
  getFavoriteContacts,
  listContacts
}
