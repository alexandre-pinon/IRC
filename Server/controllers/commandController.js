const mongoose = require('mongoose')
const User = mongoose.model('User')
const Chatroom = mongoose.model('Chatroom')

exports.nick = async (userId, newName) => {
    await User.findByIdAndUpdate(userId, { name: newName })

    return `Successfully changed user name to ${newName}!`
}

exports.list = async () => {
    const chatrooms = await Chatroom.find({})

    return chatrooms
}

exports.list = async (string) => {
    const regex = new RegExp(string, 'i')
    const chatrooms = await Chatroom.find({ 'name': regex })

    return chatrooms
}