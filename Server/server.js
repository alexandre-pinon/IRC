require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
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

const server = app.listen(8000, () => {
    console.log('Server listening on port 8000')
})

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
const jwt = require('jwt-then')
const { handleCommands, handleMessage } = require('./controllers/messageController')

const Message = mongoose.model('Message')
const User = mongoose.model('User')

io.use(async (socket, next) => {
    try  {
        const token = socket.handshake.query.token
        const payload = await jwt.verify(token, process.env.SECRET)
        socket.userId = payload.id
        next()
    } catch (error) {
        console.log('Socket.io error!', error)
    }
})

io.on('connection', (socket) => {
    console.log('Connected: ' + socket.userId)

    socket.on('disconnect', () => {
        console.log('Disconnected: ' + socket.userId)
    })

    socket.on('joinRoom', ({ chatroomId }) => {
        socket.join(chatroomId)
        console.log(`User ${socket.userId} joined chatroom ${chatroomId}!`)
    })

    socket.on('leaveRoom', ({ chatroomId }) => {
        socket.leave(chatroomId)
        console.log(`User ${socket.userId} left chatroom ${chatroomId}!`)
    })

    socket.on('chatroomMessage', async ({ chatroomId, message }) => {
        message = message.trim()
        if (message.trim().length > 0) {
            if (message[0].includes('/')) {
                handleCommands(chatroomId, message, socket, io)
            } else {
                handleMessage(chatroomId, message, socket, io)
            }
        }
    })
})