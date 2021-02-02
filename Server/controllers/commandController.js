const mongoose = require('mongoose')
const User = mongoose.model('User')
const Chatroom = mongoose.model('Chatroom')
const Message = mongoose.model('Message')

exports.nick = async (userId, newName) => {
    if (paramIsEmpty(newName)) throw 'Name field is empty!'

    await User.findByIdAndUpdate(userId, { name: newName })

    return `Successfully changed user name to ${newName}!`
}

exports.list = async (string) => {
    const regex = new RegExp(string, 'i')
    const chatrooms = await Chatroom.find({ name: regex, private: false })

    if (!chatrooms.length) throw 'No channels found!'

    return chatrooms
}

exports.create = async (userId, name) => {

    if (paramIsEmpty(name)) throw 'Name field is empty!'

    const nameRegex = /^[A-Za-z\s']+$/
    if (!nameRegex.test(name)) throw 'Chatroom name can contain only alphabets.'

    const userPromise = User.findOne({ _id: userId })
    const chatroomExistsPromise = Chatroom.findOne({ name })
    const [ user, chatroomExists ] = await Promise.all([ userPromise, chatroomExistsPromise ])

    if (chatroomExists) throw 'Chatroom with that name already exists!'

    const chatroom = new Chatroom({ name, users: [user] })

    await chatroom.save()
    const response = {
        chatroom: chatroom,
        message: `Chatroom ${chatroom.name} created`
    }

    return response
}

exports.delete = async (name) => {
    if (paramIsEmpty(name)) throw 'Name field is empty!'

    const chatroom = await Chatroom.findOne({ name })

    if (!chatroom) throw 'Channel does not exist!'
    if (chatroom.private) throw 'Cannot delete private channels!'

    const deleteMessages = Message.deleteMany({ chatroom: chatroom._id })
    const deleteChatroom = chatroom.delete()
    await Promise.all([ deleteMessages, deleteChatroom ])

    return `Chatroom ${chatroom.name} deleted!`
}

exports.join = async (userId, name) => {
    if (paramIsEmpty(name)) throw 'Name field is empty!'

    const chatroom = await Chatroom.findOne({ name: name })

    if (!chatroom) throw 'Channel does not exist!'
    if (chatroom.private) throw 'Cannot join private channels!'
    if (chatroom.users.includes(userId)) throw `You're already present in ${chatroom.name}!`

    const user = await User.findOne({ _id: userId })

    chatroom.users.push(user)
    await chatroom.save()

    const response = {
        generalMessage: `User ${user.name} has joined ${chatroom.name}!`,
        message: `You joined ${chatroom.name}!`,
        chatroom: chatroom
    }

    return response
}

exports.quit = async (userId, name) => {
    if (paramIsEmpty(name)) throw 'Name field is empty!'

    const chatroom = await Chatroom.findOne({ name: name })

    if (!chatroom) throw 'Channels does not exist!'
    if (chatroom.private) throw 'Cannot quit private channels!'
    if (!chatroom.users.includes(userId)) throw `You're not present in ${chatroom.name}!`

    const user = await User.findOne({ _id: userId })

    chatroom.users.pull(user)
    await chatroom.save()

    const response = {
        generalMessage: `User ${user.name} has left ${chatroom.name}!`,
        message: `You left ${chatroom.name}!`,
        chatroom: chatroom
    }

    return response
}

exports.users = async (chatroomId) => {
    const chatroom = await Chatroom
                            .findOne({ _id: chatroomId })
                            .populate({ path: 'users', model: 'User' })

    if (!chatroom) throw 'Channels does not exist!'
    if (!chatroom.users) throw 'There are no users in this channel!'

    return chatroom.users
}

exports.msg = async (userSenderId, userReceiverName, message) => {
    if (paramIsEmpty(userReceiverName)) throw 'No user precised!'
    if (paramIsEmpty(message)) throw 'Message is empty!'

    const senderPromise = User.findOne({ _id: userSenderId })
    const receiverPromise = User.findOne({ name: userReceiverName })
    const [ sender, receiver ] = await Promise.all([ senderPromise, receiverPromise ])

    if (!receiver) throw 'User does not exist!'

    const chatroom = await Chatroom
                                .findOne({
                                    users: { $all: [sender._id, receiver._id] },
                                    private: true
                                })
                                .populate({ path: 'users', model: 'User' })
    
    if (!chatroom) {
        const chatroom = new Chatroom({
            name: `${sender.name}&${receiver.name}`,
            users: [sender, receiver],
            private: true
        })  
        await chatroom.save()
        await Chatroom.populate(chatroom, { path: 'users', model: 'User' })
        return chatroom
    } else {
        return chatroom
    }
}

paramIsEmpty = (param) => {
    return !param || !param.trim()
}