const mongoose = require('mongoose')
const Chatroom = mongoose.model('Chatroom')

exports.createChatroom = async (request, response) => {
    const { name } = request.body
    const nameRegex = /^[A-Za-z\s']+$/

    if (!nameRegex.test(name)) {
        throw 'Chatroom name can contain only alphabets.'
    }

    const chatroomExists = await Chatroom.findOne({ name })

    if (chatroomExists) {
        throw 'Chatroom with that name already exists!'
    }

    const chatroom = new Chatroom({
        name
    })

    await chatroom.save()

    response.json({
        message: 'Chatroom created!'
    })
}