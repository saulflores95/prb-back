giconst express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// Post model
const Post = require('../../models/Post')
// Profile model
const Profile = require('../../models/Profile')
// Validation
const validatePostInput = require('../../validation/post')
// @route  GET api/posts/test
// @desc   Tests post routes
// access  Public
router.get('/test', (req, res) => {
  res.json({msg: 'Posts Works'})
})
// @route  GET api/posts/
// @desc   GET posts
// access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostsfound: 'No posts found'}))
})
// @route  GET api/posts/:id
// @desc   GET posts by id
// access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}))
})
// @route  POST api/posts
// @desc   Creative post
// access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // const { errors, isValid } = validatePostInput(req.body)
  //
  // if (!isValid) {
  //   return res.status(400).json(errors)
  // }
  const { user, club, avatar, nacionality, handicap, bio } = req.body
  console.log(req.body)
  const newPost = new Post({
    user,
    club,
    avatar,
    nacionality,
    handicap,
    bio
  })

  newPost.save().then(post => res.json(post))
})
// @route  POST api/posts/like/:id
// @desc   like post
// access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({alreadyliked: 'User already liked this post' })
          }
          post.likes.unshift({user: req.user.id})
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
})
// @route  POST api/posts/like/:id
// @desc   unlike post
// access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({notliked: 'You have not yet liked this post' })
          }
          // get remove index
          const removeIndex = post.likes.map(item => item.user.toString())
            .indexOf(req.user.id)
          post.likes.splice(removeIndex, 1)
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
})
// @route  Delete api/posts/:id
// @desc   Delete post
// access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized'})
          }
          // Delete
          post.remove().then(() => res.json({ success: true })).catch(err => res.status(404).json({ postnotfound: 'No post found' }))
        })
    })
})
// @route  Post api/posts/comment:id
// @desc   Add comment
// access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      post.comments.unshift(newComment)
      post.save()
        .then(post => res.json(post))
    })
    .catch(err => res.status(404).json({postnotfound: 'No post found'}))
})

// @route  Delete api/posts/comment/:id/:comment_id
// @desc   Delete a comment from post
// access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
    // Check to see if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' })
      }
      // Get remove index
      const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)
      // splice comment out of array
      post.comments.splice(removeIndex, 1)
      // save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({postnotfound: 'No post found'}))
})
module.exports = router
