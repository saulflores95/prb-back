const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'club'
  },
  avatar: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    default: Date.now,
    required: true,
  },
  handicap: {
    type: Number,
    required: true
  },
  bio: {
    type: String
  },
  nacionality: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)
