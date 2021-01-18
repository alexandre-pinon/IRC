const mongoose = require('mongoose')

const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required!'
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        required: 'User is required!',
        ref: 'User'
    }
})

module.exports = mongoose.model('Chatroom', chatroomSchema)