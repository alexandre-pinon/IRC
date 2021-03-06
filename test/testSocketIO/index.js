var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('chat message', (message) => {
        console.log('message: ' + message)
        io.emit('chat message', message)
    })
    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})