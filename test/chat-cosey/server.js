require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection.on('error', (error) => {
    console.log('Mongoose Connection ERROR: ' + error.message)
})

mongoose.connection.once('open', () => {
    console.log('MongoDB Connected!')
})

require('./models/User')
require('./models/Chatroom')
require('./models/Message')

const app = require('./app')

app.listen(8000, () => {
    console.log('Server listening on port 8000')
})