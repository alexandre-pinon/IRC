const mongoose = require('mongoose')
const { request, response } = require('../app')
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
    const chatrooms = await Chatroom.find({ 'users': userId }).populate({
        path: 'users',
        model: 'User'
    })

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

exports.getUsers = async (request, response) => {
    const chatroomId = request.body.chatroomId
    try {
        const users = await chatCommand.users(chatroomId)
        response.json({
            users: users
        })
    } catch (error) {
        throw error
    }
}

exports.editChatroom = async (request, response) => {
    const { chatroomId, newName } = request.body
    if (paramIsEmpty(newName)) {
        throw 'Name field is empty!'
    }

    const chatroomExists = await Chatroom.findOne({ name: newName })
    if (chatroomExists) {
        throw 'Chatroom with that name already exists!'
    }

    const chatroom = await Chatroom.findOne({ _id: chatroomId })
    if(chatroom.private) {
        throw 'Cannot edit private channel!'
    }

    chatroom.name = newName
    chatroom.save()

    response.json({
        message: `Successfully changed channel name to ${newName}!`
    })  
}

paramIsEmpty = (param) => {
    return !param || !param.trim()
}