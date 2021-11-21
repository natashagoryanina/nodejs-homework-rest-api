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
  console.log(req.params)
  const { contactId } = req.params
  try {
    const result = await service.getContactsById(contactId)
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
        message: `Can't find contact by id: ${contactId}`,
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
  const { contactId } = req.params
  const { name, email, phone } = req.body
  try {
    const result = await service.updateContact(contactId, { name, email, phone })
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
        message: `Can't find contact by id: ${contactId}`,
        data: 'Not Found',
      })
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params
  const { favorite = false } = req.body
  console.log(typeof req.body)
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'missing field favorite',
      data: 'Not Found',
    })
  }
  try {
    const result = await service.updateContact(contactId, { favorite })
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
        message: `Can't find contact by id: ${contactId}`,
        data: 'Not Found',
      })
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const remove = async (req, res, next) => {
  const { contactId } = req.params

  try {
    const result = await service.removeContact(contactId)
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
        message: `Can't find contact by id: ${contactId}`,
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
