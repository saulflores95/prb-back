const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// Federation model
const Federation = require('../../models/Federation')
// Validation
//const validateFederationInput = require('../../validation/Federation')
// @route  GET api/Federations/test
// @desc   Tests Federation routes
// access  Public
router.get('/test', (req, res) => {
  res.json({msg: 'Federations Works'})
})
// @route  GET api/Federations/
// @desc   GET Federations
// access  Public
router.get('/', (req, res) => {
  Federation.find()
    .sort({ date: -1 })
    .then(federations => res.json(federations))
    .catch(err => res.status(404).json({noFederationsfound: 'No Federations found'}))
})
// @route  GET api/Federations/:id
// @desc   GET Federations by id
// access  Public
router.get('/:id', (req, res) => {
  Federation.findById(req.params.id)
    .then(federation => res.json(federation))
    .catch(err => res.status(404).json({noFederationFound: 'No Federation found with that ID'}))
})
// @route  Federation api/Federations
// @desc   Creative Federation
// access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  //const { errors, isValid } = validateFederationInput(req.body)
  //
  // if (!isValid) {
  //   return res.status(400).json(errors)
  // }

  const { title, president, nation, name, logo, founded, description } = req.body
  const newFederation = new Federation({
    title,
    nation,
    logo,
    founded,
    president,
    description
  })

  newFederation.save().then(federation => res.json(federation))
})
// @route  Delete api/Federations/:id
// @desc   Delete Federation
// access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Federation.findById(req.params.id)
        .then(Federation => {
          if (Federation.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized'})
          }
          // Delete
          Federation.remove().then(() => res.json({ success: true })).catch(err => res.status(404).json({ Federationnotfound: 'No Federation found' }))
        })
    })
})

module.exports = router
