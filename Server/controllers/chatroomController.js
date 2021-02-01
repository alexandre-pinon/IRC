const mongoose = require('mongoose')
const chatCommand = require('./commandController')
const Chatroom = mongoose.model('Chatroom')
const User = mongoose.model('User')

exports.getAllChatrooms = async (request, response) => {
    try {
        const chatrooms = await chatCommand.list()
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
        const chatrooms = await chatCommand.list(request.body.string)
        response.json(chatrooms)
    } catch (error) {
        throw error
    }
}

exports.addUserToChatroom = async (request, response) => {
    const { name, userId } = request.body
    try {
        const res = await chatCommand.join(userId, name)
        response.json({
            generalMessage: res.generalMessage,
            message: res.message,
            chatroom: res.chatroom
    })
    } catch (error) {
        throw error
    }
}

exports.deleteUserFromChatroom = async (request, response) => {
    const { name, userId } = request.body
    try {
        const res = await chatCommand.quit(userId, name)
        response.json({
            generalMessage: res.generalMessage,
            message: res.message,
            chatroom: res.chatroom
        })
    } catch (error) {
        throw error
    }
}

exports.createChatroom = async (request, response) => {
    const { name, userId } = request.body
    try {
        const res = await chatCommand.create(userId, name)
        response.json({
            chatroom: res.chatroom,
            message: res.message
        })
    } catch (error) {
        throw error
    }
}

exports.deleteChatroom = async (request, response) => {
    const name = request.body.name
    try {
        const message = await chatCommand.delete(name)
        response.json({
            message: message
        })
    } catch (error) {
        throw error
    }
}