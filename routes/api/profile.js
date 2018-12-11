const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// Load Validations
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

// Load Profile Model
const Profile = require('../../models/Profile')
// Load Profile User
const User = require('../../models/User')
// @route  GET api/profile/test
// @desc   Tests profile routes
// access  Public
router.get('/test', (req, res) => {
  res.json({msg: 'Profile Works'})
})
// @route  GET api/profile/
// @desc   Ger users profile
// access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {}
  Profile.findOne({ user: req.user.id })
    .populate('user', ['username', 'avatar', 'type'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})
// @route  POST api/profile/
// @desc   Registeres a users profile
// access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const errors = {}

  const foundProfile = await Profile.findOne({ user: req.user.id })
  if (foundProfile) {
    return res.status(403).json({ error: 'Profile has already been created'});
  }

  const { user, club, avatar, nacionality, handicap, bio } = req.body

  const newProfile = new Profile({
    user,
    club,
    avatar,
    nacionality,
    handicap,
    bio
  })

  console.log(newProfile)
  await newProfile.save();
})
// @route  Get api/profile/all/
// @desc   get all profiles
// @access Public
router.put('/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {}
  const { user, club, avatar, nacionality, handicap, bio } = req.body
  Profile.update({'user': req.user.id }, { user, club, avatar, nacionality, handicap, bio  }, (err) => console.log(err))
})
// @route  POST api/profile/
// @desc   Registeres a users profile
// access  Private
router.get('/all', (req, res) => {
  const errors = {}
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'
        return res.status(404).json(errors)
      }
      res.json(profiles)
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }))
})
// @route  Get api/profile/handle/:handle
// @desc   get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {}
  Profile.findOne({handle: req.params.handle })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})
// @route  Get api/profile/user/:user
// @desc   get profile by user ID
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {}
  Profile.findOne({user: req.params.user_id })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
})
// @route  DELETE api/profile/education/:edu_id
// @desc   Delete education from profile
// access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id)
    // Splice out of array
    profile.education.splice(removeIndex, 1)
    // save
    profile.save().then(profile => res.json(profile))
  })
    .catch(err => res.status(404).json(err))
})
// @route  DELETE api/profile/
// @desc   Delete user and profile
// access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }))
  })
})
module.exports = router
