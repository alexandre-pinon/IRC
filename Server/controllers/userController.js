const mongoose = require('mongoose')
const User = mongoose.model('User')
const sha256 = require('js-sha256')
const jwt = require('jwt-then')
const { nick } = require('./commandController')

exports.register = async (request, response) => {
    const { name, email, password } = request.body
    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/

    if (!emailRegex.test(email)) {
        throw 'Email is not supported from your domain.'
    }
    if (password.length < 6) {
        throw 'Password must be atleast 6 characters long.'
    }

    const userExists = await User.findOne({
        email
    })

    if (userExists) {
        throw 'User with same email already exists.'
    }

    const user = new User({
        name,
        email,
        password: sha256(password + process.env.SALT)
    })

    await user.save()

    response.json({
        message: `User ${name} registered successfully!`
    })
}

exports.login = async (request, response) => {
    const { email, password } = request.body
    const user = await User.findOne({
        email,
        password: sha256(password + process.env.SALT)
    })

    if (!user) {
        throw 'Email and Password did not match'
    }

    const token = await jwt.sign({ id: user.id }, process.env.SECRET)

    response.json({
        message: 'User logged in successfully!',
        token,
        username: user.name
    })
}

exports.changeName = async (request, response) => {
    const { userId, newName } = request.body
    const message = nick(userId, newName)

    response.json({
        message: message
    })
}