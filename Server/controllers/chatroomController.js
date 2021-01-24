const mongoose = require('mongoose')
const Chatroom = mongoose.model('Chatroom')
const User = mongoose.model('User')

exports.getAllChatrooms = async (request, response) => {
    const chatrooms = await Chatroom.find({})

    response.json(chatrooms)
}

exports.getChatroomsByUser = async (request, response) => {
    const userId = request.params.userId
    const chatrooms = await Chatroom.find({ 'users': userId })

    response.json(chatrooms)
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
    console.log('JOIN', { chatroomId, userId, user, chatroom })

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
    console.log('DELETE', { chatroomId, userId, user, chatroom })

    response.json({
        message: `User ${user.name} has left ${chatroom.name}!`
    })
}

exports.createChatroom = async (request, response) => {
    const { name, userId } = request.body
    const user = await User.findOne({ _id: userId })
    const nameRegex = /^[A-Za-z\s']+$/

    if (!nameRegex.test(name)) {
        throw 'Chatroom name can contain only alphabets.'
    }

    const chatroomExists = await Chatroom.findOne({ name })

    if (chatroomExists) {
        throw 'Chatroom with that name already exists!'
    }

    const chatroom = new Chatroom({
        name,
        users: [user]
    })

    await chatroom.save()

    response.json({
        message: 'Chatroom created!'
    })
}