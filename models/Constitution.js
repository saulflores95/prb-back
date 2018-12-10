const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ConstSchema = new Schema({
  federation: {
    type: Schema.Types.ObjectId,
    ref: 'federation'
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  declarationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Constitution = mongoose.model('constitution', ConstSchema)
