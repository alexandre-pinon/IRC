const mongoose = require('mongoose')
const chatCommand = require('./commandController')
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
    const argument1 = message.split(' ')[1]
    const argument2 = message.split(' ')[2]
    const argument = argument2 ? `${argument1} ${argument2}` : argument1
    
    let commands = {
        '/nick': async () => {
            try {
                const message = await chatCommand.nick(socket.userId, argument)
                const response = {
                    message: message,
                    newName: argument
                }
                socket.emit('nick', response)
                socket.emit('ok', response)
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
        },
        '/list': async () => {
            try {
                const chatrooms = await chatCommand.list(argument)
                let response = {
                    name: 'PlooV4',
                    userId: socket.userId
                }
                const message = chatrooms
                                    .map(chatroom => chatroom.name)
                                    .join(', ')
                response.message = `Available channels : ${message}`
                socket.emit('newMessage', response)
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
        },
        '/create': async () => {
            try {
                const message = await chatCommand.create(
                    socket.userId,
                    argument
                )
                const response = {
                    message: message
                }
                socket.emit('ok', response)
                socket.emit('refresh channels')
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
        },
        '/delete': async () => {
            try {
                const message = await chatCommand.delete(argument)
                const response = {
                    message: message
                }
                socket.emit('ok', response)
                socket.emit('refresh channels')
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
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
