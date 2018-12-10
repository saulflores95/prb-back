const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport') // main auth module
// express image handeling
const cors = require('cors')
const mutilpart = require('connect-multiparty')
// Routes
const user = require('./routes/api/user')
const profile = require('./routes/api/profile')
const federation = require('./routes/api/federation')
const constitution = require('./routes/api/constitution')
const rulebook = require('./routes/api/rulebook')

// Initiate express app
const app = express()
//  Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(mutilpart())

// DB Config
const db = require(('./config/keys')).mongoURI
// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))
// Pasport middleware
app.use(passport.initialize())
// Passport Config
require('./config/passport')(passport)
// Cors
app.use(cors())
// Use Routes
app.use('/api/user', user)
app.use('/api/profile', profile)
app.use('/api/federation', federation)
app.use('/api/constitution', constitution)
app.use('/api/rulebook', rulebook)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`)
})
