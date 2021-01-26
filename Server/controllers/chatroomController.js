const mongoose = require('mongoose')
const chatCommand = require('./commandController')
const Chatroom = mongoose.model('Chatroom')
const User = mongoose.model('User')

exports.getAllChatrooms = async (request, response) => {
    try {
        const chatrooms = chatCommand.list()
        response.json(chatrooms)
    } catch (error) {
        throw error
    }
}

exports.getChatroomsByUser = async (request, response) => {
    const userId = request.params.userId
    const chatrooms = await Chatroom.find({ 'users': userId })

    response.json(chatrooms)
}

exports.getChatroomsByString = async (request, response) => {
    try {
        const chatrooms = chatCommand.list(request.body.string)
        response.json(chatrooms)
    } catch (error) {
        throw error
    }
}

exports.addUserToChatroom = async (request, response) => {
    const { chatroomId, userId } = request.body
    const user = await User.findOne({ _id: userId })
    const chatroom = await Chatroom.findById(chatroomId)

    if (chatroom.users.includes(userId)) {
        throw `User already in ${chatroom.name}!`
    }

    await chatroom.users.push(user)
    await chatroom.save()

    response.json({
        message: `User ${user.name} has joined ${chatroom.name}!`
    })
}

exports.deleteUserFromChatroom = async (request, response) => {
    const { chatroomId, userId } = request.body
    const user = await User.findOne({ _id: userId })
    const chatroom = await Chatroom.findById(chatroomId)

    if (!chatroom.users.includes(userId)) {
        throw `User not present in ${chatroom.name}!`
    }

    await chatroom.users.pull(user)
    await chatroom.save()

    response.json({
        message: `User ${user.name} has left ${chatroom.name}!`
    })
}

exports.createChatroom = async (request, response) => {
    const { name, userId } = request.body
    try {
        const message = chatCommand.create(userId, name)
        response.json({
            message: message
        })
    } catch (error) {
        throw error
    }
}

exports.deleteChatroom = async (request, response) => {
    const name = request.body.name
    try {
        const message = chatCommand.delete(name)
        response.json({
            message: message
        })
    } catch (error) {
        throw error
    }
}