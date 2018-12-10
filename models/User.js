const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook']
  },
  local: {
    name: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
       type: String,
       lowercase: true
     }
  },
  facebook: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
       type: String,
       lowercase: true
     }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function(next) {
  try {
    console.log('entered');
    if (this.method !== 'local') {
      next();
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;
    console.log('exited');
    next();
  } catch(error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch(error) {
    throw new Error(error);
  }
}

module.exports = User = mongoose.model('users', UserSchema)
