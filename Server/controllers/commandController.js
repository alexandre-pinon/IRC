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

exports.create = async (userId, name) => {

    const nameIsEmpty = !name || !name.trim()
    if (nameIsEmpty) {
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

    return 'Chatroom created!'
}