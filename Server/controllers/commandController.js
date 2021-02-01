const mongoose = require('mongoose')
const User = mongoose.model('User')
const Chatroom = mongoose.model('Chatroom')
const Message = mongoose.model('Message')

exports.nick = async (userId, newName) => {
    if (paramIsEmpty(newName)) {
        throw 'Name field is empty!'
    }

    await User.findByIdAndUpdate(userId, { name: newName })

    return `Successfully changed user name to ${newName}!`
}

exports.list = async (string) => {
    const regex = new RegExp(string, 'i')
    const chatrooms = await Chatroom.find({ 'name': regex })
    if (!chatrooms.length) {
        throw 'No channels found!'
    }

    return chatrooms
}

exports.create = async (userId, name) => {

    if (paramIsEmpty(name)) {
        throw 'Name field is empty!'
    }

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
    const response = {
        chatroom: chatroom,
        message: `Chatroom ${chatroom.name} created`
    }

    return response
}

exports.delete = async (name) => {
    if (paramIsEmpty(name)) {
        throw 'Name field is empty!'
    }

    const chatroom = await Chatroom.findOne({ name })

    if (!chatroom) {
        throw 'Channels does not exist!'
    }
    await Message.deleteMany({ chatroom: chatroom._id })
    await chatroom.delete()

    return `Chatroom ${chatroom.name} deleted!`
}

exports.join = async (userId, name) => {
    if (paramIsEmpty(name)) {
        throw 'Name field is empty!'
    }

    const chatroom = await Chatroom.findOne({ name: name })

    if (!chatroom) {
        throw 'Channels does not exist!'
    }

    if (chatroom.users.includes(userId)) {
        throw `You're already present in ${chatroom.name}!`
    }

    const user = await User.findOne({ _id: userId })

    await chatroom.users.push(user)
    await chatroom.save()

    const response = {
        generalMessage: `User ${user.name} has joined ${chatroom.name}!`,
        message: `You joined ${chatroom.name}!`,
        chatroom: chatroom
    }

    return response
}

exports.quit = async (userId, name) => {
    if (paramIsEmpty(name)) {
        throw 'Name field is empty!'
    }

    const chatroom = await Chatroom.findOne({ name: name })

    if (!chatroom) {
        throw 'Channels does not exist!'
    }

    if (!chatroom.users.includes(userId)) {
        throw `You're not present in ${chatroom.name}!`
    }

    const user = await User.findOne({ _id: userId })

    await chatroom.users.pull(user)
    await chatroom.save()

    const response = {
        generalMessage: `User ${user.name} has left ${chatroom.name}!`,
        message: `You left ${chatroom.name}!`,
        chatroom: chatroom
    }

    return response
}

exports.users = async (chatroomId) => {
    const chatroom = await Chatroom.findOne({ _id: chatroomId }).populate({
        path: 'users',
        model: 'User'
    })

    if (!chatroom) {
        throw 'Channels does not exist!'
    }

    if (!chatroom.users) {
        throw 'There are no users in this channel!'
    }

    return chatroom.users
}

paramIsEmpty = (param) => {
    return !param || !param.trim()
}