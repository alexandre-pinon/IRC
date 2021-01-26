const mongoose = require('mongoose')
const { nick } = require('./commandController')
const Message = mongoose.model('Message')
const User = mongoose.model('User')

exports.getMessagesByChatroom = async (request, response) => {
    const chatroomId = request.body.chatroomId
    const messagesTable = await Message
                                    .find({ 'chatroom': chatroomId })
                                    .populate('user')

    const messages = messagesTable.map(messageTable => ({
        message: messageTable.message,
        name: messageTable.user.name,
        userId: messageTable.user._id
    }))

    console.log('GET')

    response.json(messages)
}

exports.handleCommands = (message, socket) => {

    const command = message.split(' ')[0]
    const argument = message.split(' ')[1]
    
    let commands = {
        '/nick': async () => {
            console.log('nick', argument)
            const message = await nick(socket.userId, argument)
            const response = {
                message: message,
                newName: argument
            }
            socket.emit('command', response)
        },
        '/list': () => {
            console.log('list', argument)
        },
        '/create': () => {
            console.log('create', argument)
        },
        '/delete': () => {
            console.log('delete', argument)
        },
        '/join': () => {
            console.log('join', argument)
        },
        '/quit': () => {
            console.log('quit', argument)
        },
        '/users': () => {
            console.log('users', argument)
        },
        '/msg': () => {
            console.log('msg', argument)
        },
        'default': () => {
            console.log('default', argument)
        }
    };

    (commands[command] || commands['default'])()
}

exports.handleMessage = async (chatroomId, message, socket, io) => {
    const user = await User.findOne({ _id: socket.userId })
    const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message: message
    })

    io.to(chatroomId).emit('newMessage', {
        message: message,
        name: user.name,
        userId: socket.userId
    })
    await newMessage.save()
}
