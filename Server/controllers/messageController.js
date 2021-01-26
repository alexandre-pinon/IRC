const mongoose = require('mongoose')
const { nick, list, create } = require('./commandController')
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

exports.handleCommands = async (message, socket) => {

    const command = message.split(' ')[0]
    const argument1 = message.split(' ')[1]
    const argument2 = message.split(' ')[2]
    const argument = argument2 ? `${argument1} ${argument2}` : argument1
    const user = await User.findOne({ _id: socket.userId })
    
    let commands = {
        '/nick': async () => {
            console.log('nick', argument)
            const message = await nick(socket.userId, argument)
            const response = {
                message: message,
                newName: argument
            }
            socket.emit('nick', response)
            socket.emit('ok', response)
        },
        '/list': async () => {
            console.log('list', argument)
            const chatrooms = argument ? await list(argument) : await list()
            let response = {
                name: 'PlooV4',
                userId: socket.userId
            }
            if (chatrooms.length > 0) {
                const message = chatrooms
                                    .map(chatroom => chatroom.name)
                                    .join(', ')
                response.message = `Available channels : ${message}`
                socket.emit('newMessage', response)
            } else {
                const response = {
                    error: 'No channels found!'
                }
                socket.emit('error', response)
            }
        },
        '/create': async () => {
            console.log('create', argument)
            try {
                const message = await create(socket.userId, argument)
                const response = {
                    message: message
                }
                socket.emit('ok', response)
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
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
