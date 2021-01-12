const express = require('express')
const cors = require('cors')
const app = express()


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/test', (request, response) => {
    response.json({message: 'This is CORS-enabled for all origins!'})
})


app.use('/user', require('./routes/user'))
app.use('/chatroom', require('./routes/chatroom'))

const errorHandlers = require('./handlers/errorHandlers')
app.use(errorHandlers.notFound)
app.use(errorHandlers.mongooseErrors)
if (process.env.ENV === 'DEVELOPMENT') {
    app.use(errorHandlers.developmentErrors)
} else {
    app.use(errorHandlers.productionErrors)
}

module.exports = app