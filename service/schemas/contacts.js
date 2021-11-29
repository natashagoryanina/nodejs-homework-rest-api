const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
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
    validate: [/\S+@\S+\.\S+/, 'not valid'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: [/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s.]{0,1}[0-9]{3}[-\s.]{0,1}[0-9]{4}$/, 'not valid']
  },
  favorite: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
  }
}, { versionKey: false, timestamps: true })

contacts.plugin(mongoosePaginate)
const Contacts = mongoose.model('contacts', contacts)

Contacts.paginate().then({})

module.exports = Contacts
