const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const passportSignIn = passport.authenticate('local', { session: false });
const passportConf = require('../../config/passport')
// Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
// Load user model
const User = require('../../models/User')
//  Sign Token
const signToken = user => {
  // Sign Token
  return jwt.sign({
    iss: 'FromTJ',
    id: user.id,
    name: user[user.method].name,
    lastName: user[user.method].lastName,
    email: user[user.method].email,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, keys.secretOrKey)
}
// @route  GET api/users/test
// @desc   Tests profile routes
// access  Public
router.get('/test', (req, res) => {
  res.json({msg: 'Users Works'})
})
// @route  POST api/users/register
// @desc   Register a user
// access  Public
router.post('/register', async (req, res, next) => {
  const { email, name, lastName, password } = req.body

  // Check if there is a user with the same email
  const foundUser = await User.findOne({ "local.email": email });
  if (foundUser) {
    return res.status(403).json({ error: 'Email is already in use'});
  }

  // Create a new user
  const newUser = new User({
    method: 'local',
    local: {
      email,
      name,
      lastName,
      password
    }
  });
  await newUser.save();

  // Generate the token
  const token = signToken(newUser);
  // Respond with token
  res.status(200).json({ token });
})
// @route  POST api/users/register
// @desc   Register a user
// access  Public
router.post('/login', passportSignIn, async (req, res, next) => {
  const token = signToken(req.user);
  res.status(200).json({ token });
})
// @route  POST api/users/current
// @desc   Returns current user
// access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.user)
  res.json({
    id: req.user.id,
    name: req.user.local.name,
    lastName: req.user.local.lastName,
    email: req.user.local.email
  })
})
// @route  POST api/users/:username
// @desc   Returns by username
// access  Public
router.get('/:username', (req, res) => {
  let username = req.params.username.toString()
  User.findOne({ username }).then(user => {
    // Check for user
    if (!user) {
      return res.status(400).json('Nombre de usuario inexistente')
    } else {
      const payload = {
        id: user.id,
        name: user.name,
      }
      return res.status(200).json(payload)
    }
  })
})
// @route  POST api/users/auth/google
// @desc
// access  Public
router.post('/oauth/google',  passport.authenticate('googletoken', { session: false }), async (req, res, next) => {
  // Generate token
  const token = signToken(req.user)
  // Return access token to client
  res.status(200).json({ token })
})
// @route  GET api/users/auth/facebook
// @desc
// access  Public
router.post('/oauth/facebook',  passport.authenticate('facebooktoken', { session: false }), async (req, res, next) => {
  // Generate token
  const token = signToken(req.user)
  // Return access token to client
  res.status(200).json({ token })
})

module.exports = router
