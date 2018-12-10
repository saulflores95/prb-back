const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const FederationSchema = new Schema({
  president: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true,
  },
  nation: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  founded: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Federation = mongoose.model('federation', FederationSchema)
