//Load diffrent passport strategies for social networks
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const LocalStrategy = require('passport-local').Strategy;
//Import Mongoose Models
const mongoose = require('mongoose')
const User = require('../models/User');
const keys = require('../config/keys')
const oAuthConfig = require('../config/oauth')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: keys.secretOrKey
  }, async (payload, done) => {
    try {
      // Find the user specified in token
      const user = await User.findById(payload.id);

      // If user doesn't exists, handle it
      if (!user) {
        return done(null, false);
      }

      // Otherwise, return the user
      done(null, user);
    } catch(error) {
      done(error, false);
    }
  }));

  passport.use('facebooktoken',
    new FacebookTokenStrategy({
      clientID: oAuthConfig.facebook.clientID,
      clientSecret: oAuthConfig.facebook.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ "facebook.id": profile.id })
      if(existingUser) {
        console.log('User already exists in our DB')
        return done(null, existingUser)
      }
      console.log('User doesnt exists were createing a new in our DB')
      const newUser = new User({
        method: 'facebook',
        facebook: {
          id: profile.id,
          name: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        }
      })
      await newUser.save()
      done(null, newUser)
    } catch(error) {
      done(error, false, error.message)
    }
  }))

  passport.use('googletoken',
    new GooglePlusTokenStrategy({
      clientID: oAuthConfig.google_plus.clientID,
      clientSecret: oAuthConfig.google_plus.clientSecret,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      //  Chech wether this current user exists in our DB
      const existingUser = await User.findOne({"google.id": profile.id})
      if(existingUser) {
        console.log('User already exists in our DB')
        return done(null, existingUser)
      }
      console.log('User doesnt exists were createing a new in our DB')
      //  If new ac count
      const newUser = new User({
        method: 'google',
        google: {
          id: profile.id,
          name: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        }
      })
      await newUser.save()
      done(null, newUser)
    } catch (e) {
      done(e, false, e.message)
    }
  }))

  // LOCAL STRATEGY
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      // Find the user given the email
      const user = await User.findOne({ "local.email": email });

      // If not, handle it
      if (!user) {
        return done(null, false);
      }

      // Check if the password is correct
      const isMatch = await user.isValidPassword(password);

      // If not, handle it
      if (!isMatch) {
        return done(null, false);
      }

      // Otherwise, return the user
      done(null, user);
    } catch(error) {
      done(error, false);
    }
  }));


}
