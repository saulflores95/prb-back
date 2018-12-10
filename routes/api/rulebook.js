const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// RuleBook model
const RuleBook = require('../../models/RuleBook')
// Validation
//const validateRuleBookInput = require('../../validation/RuleBook')
// @route  GET api/RuleBooks/test
// @desc   Tests RuleBook routes
// access  Public
router.get('/test', (req, res) => {
  res.json({msg: 'RuleBooks Works'})
})
// @route  GET api/RuleBooks/
// @desc   GET RuleBooks
// access  Public
router.get('/', (req, res) => {
  RuleBook.find()
    .sort({ date: -1 })
    .then(rulebooks => res.json(rulebooks))
    .catch(err => res.status(404).json({noRuleBooksfound: 'No RuleBooks found'}))
})
// @route  GET api/RuleBooks/:id
// @desc   GET RuleBooks by id
// access  Public
router.get('/:id', (req, res) => {
  RuleBook.findById(req.params.id)
    .then(rulebook => res.json(rulebook))
    .catch(err => res.status(404).json({noRuleBookFound: 'No RuleBook found with that ID'}))
})
// @route  RuleBook api/RuleBooks
// @desc   Creative RuleBook
// access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  //const { errors, isValid } = validateRuleBookInput(req.body)
  //
  // if (!isValid) {
  //   return res.status(400).json(errors)
  // }

  const { federation, title, description } = req.body
  const newRuleBook = new RuleBook({
    federation,
    title,
    description
  })

  newRuleBook.save().then(rulebook => res.json(rulebook))
})
// @route  Delete api/RuleBooks/:id
// @desc   Delete RuleBook
// access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      RuleBook.findById(req.params.id)
        .then(RuleBook => {
          if (RuleBook.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized'})
          }
          // Delete
          RuleBook.remove().then(() => res.json({ success: true })).catch(err => res.status(404).json({ RuleBooknotfound: 'No RuleBook found' }))
        })
    })
})

module.exports = router
