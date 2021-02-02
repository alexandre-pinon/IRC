const mongoose = require('mongoose')
const Chatroom = mongoose.model('Chatroom')

exports.getChatroomsByUser = async (request, response) => {
    const userId = request.params.userId
    const chatrooms = await Chatroom
                                .find({ 'users': userId })
                                .populate({ path: 'users', model: 'User' })

    response.json(chatrooms)
}

exports.editChatroom = async (request, response) => {
    const { chatroomId, newName } = request.body
    if (paramIsEmpty(newName)) throw 'Name field is empty!'

    const chatroomExistsPromise = Chatroom.findOne({ name: newName })
    const chatroomPromise = Chatroom.findOne({ _id: chatroomId })

    const [ chatroomExists, chatroom ] = await Promise.all([chatroomExistsPromise, chatroomPromise])
    if (chatroomExists) throw 'Chatroom with that name already exists!'
    if (chatroom.private) throw 'Cannot edit private channel!'

    chatroom.name = newName
    chatroom.save()

    response.json({ message: `Successfully changed channel name to ${newName}!` })  
}

paramIsEmpty = (param) => {
    return !param || !param.trim()
}