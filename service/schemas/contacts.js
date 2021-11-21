const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contacts = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 2,
    maxlength: 25
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [/\S+@\S+\.\S+/, 'not valid']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: [/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s.]{0,1}[0-9]{3}[-\s.]{0,1}[0-9]{4}$/, 'not valid']
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Contacts = mongoose.model('contacts', contacts)

module.exports = Contacts
