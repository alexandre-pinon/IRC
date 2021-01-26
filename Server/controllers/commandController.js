const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.nick = async (userId, newName) => {
    await User.findByIdAndUpdate(userId, { name: newName })

    return `Successfully changed user name to ${newName}!`
}