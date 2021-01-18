const mongoose = require('mongoose')
const Chatroom = mongoose.model('Chatroom')
const User = mongoose.model('User')

exports.getAllChatrooms = async (request, response) => {
    const chatrooms = await Chatroom.find({})

    response.json(chatrooms)
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