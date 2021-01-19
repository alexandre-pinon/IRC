const mongoose = require('mongoose')
const Message = mongoose.model('Message')

exports.getMessagesByChatroom = async (request, response) => {
    const chatroomId = request.body.chatroomId
    const messages = await Message.find({ 'chatroom': chatroomId })
    console.log(messages, chatroomId)

    response.json(messages)
}

