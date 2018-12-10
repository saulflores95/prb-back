const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// Constitution model
const Constitution = require('../../models/Constitution')
// Validation
//const validateConstitutionInput = require('../../validation/Constitution')
// @route  GET api/Constitutions/test
// @desc   Tests Constitution routes
// access  Public
router.get('/test', (req, res) => {
  res.json({msg: 'Constitutions Works'})
})
// @route  GET api/Constitutions/
// @desc   GET Constitutions
// access  Public
router.get('/', (req, res) => {
  Constitution.find()
    .sort({ date: -1 })
    .then(constitutions => res.json(constitutions))
    .catch(err => res.status(404).json({noConstitutionsfound: 'No Constitutions found'}))
})
// @route  GET api/Constitutions/:id
// @desc   GET Constitutions by id
// access  Public
router.get('/:id', (req, res) => {
  Constitution.findById(req.params.id)
    .then(constitution => res.json(constitution))
    .catch(err => res.status(404).json({noConstitutionFound: 'No Constitution found with that ID'}))
})
// @route  Constitution api/Constitutions
// @desc   Creative Constitution
// access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  //const { errors, isValid } = validateConstitutionInput(req.body)
  //
  // if (!isValid) {
  //   return res.status(400).json(errors)
  // }

  const { federation, title, description } = req.body
  const newConstitution = new Constitution({
    federation,
    title,
    description
  })

  newConstitution.save().then(constitution => res.json(constitution))
})
// @route  Delete api/Constitutions/:id
// @desc   Delete Constitution
// access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Constitution.findById(req.params.id)
        .then(Constitution => {
          if (Constitution.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized'})
          }
          // Delete
          Constitution.remove().then(() => res.json({ success: true })).catch(err => res.status(404).json({ Constitutionnotfound: 'No Constitution found' }))
        })
    })
})

module.exports = router
