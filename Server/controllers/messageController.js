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


    response.json(messages)
}

exports.handleCommands = (chatroomId, message, socket, io) => {
    let [command, ...argument] = message.split(' ')
    argument = argument.join(' ')
    
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
                const message = chatrooms
                                    .map(chatroom => chatroom.name)
                                    .join(', ')
                const response = {
                    name: 'PlooV4',
                    message: `Available channels : ${message}`,
                    userId: socket.userId
                }
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
                const response = await chatCommand.create(
                    socket.userId,
                    argument
                )
                socket.emit('ok', response)
                socket.emit('refresh channels')
                socket.once('channels refreshed', () => {
                    socket.emit('activate channel', response)
                })
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
        '/join': async () => {
            try {
                const response = await chatCommand.join(
                    socket.userId,
                    argument
                )
                io.to(response.chatroom._id.toString()).emit('newMessage', {
                    message: response.generalMessage,
                    name: 'PlooV4',
                    userId: socket.userId
                })
                socket.emit('ok', response)
                socket.emit('refresh channels')
                socket.once('channels refreshed', () => {
                    socket.to(response.chatroom._id.toString()).emit('activate channel', response)
                    socket.emit('activate channel', response)
                })
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
        },
        '/quit': async () => {
            try {
                const response = await chatCommand.quit(
                    socket.userId,
                    argument
                )
                io.to(response.chatroom._id.toString()).emit('newMessage', {
                    message: response.generalMessage,
                    name: 'PlooV4',
                    userId: socket.userId
                })
                socket.emit('ok', response)
                socket.emit('refresh channels')
                socket.once('channels refreshed', () => {
                    socket.to(response.chatroom._id.toString()).emit('activate channel', response)
                })
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
        },
        '/users': async () => {
            try {
                const users = await chatCommand.users(chatroomId)
                const usernames = users
                                    .map(user => user.name)
                                    .join(', ')
                const response = {
                    name: 'PlooV4',
                    message: `Users in this channel : ${usernames}`,
                    userId: socket.userId
                }
                socket.emit('newMessage', response)
            } catch (error) {
                const response = {
                    error: error
                }
                socket.emit('error', response)
            }
        },
        '/msg': async () => {
            console.log('msg', argument)
            try {
                let [userSenderName, ...message] = argument.split(' ')
                message = message.join(' ')

                const chatroom = await chatCommand.msg(socket.userId, userSenderName, message)
                this.handleMessage(chatroom._id, message, socket, io)

                const response = {
                    chatroom: chatroom
                }

                socket.emit('refresh channels')
                socket.once('channels refreshed', () => {
                    socket.emit('activate channel', response)
                })
            } catch (error) {
                const response = {
                    error: error
                }
                console.log(response)
                socket.emit('error', response)
            }
        },
        'default': () => {
            console.log('default', argument)
            const response = {
                error: 'Unknown command!'
            }
            socket.emit('error', response)
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
