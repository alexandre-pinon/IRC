import React from 'react'
import { withRouter } from 'react-router-dom'

const ChatroomPage = ({ match, socket }) => {
    const chatroomId = match.params.id
    const [messages, setMessages] = React.useState([])
    
    React.userEffect(() => {
        socket.emit('joinRoom', {
            chatroomId
        })

        socket.on('newMessage', ({message, userId}) => {
            setMessages(message)
        })

        return () => {
            socket.emit('leaveRoom', {
                chatroomId
            })
        }
        //eslint-disable-next-line
    }, [])

    return (
        <div className='chatroomPage'>
            <div className='chatroomSection'>
                <div className='cardHeader'>Chatroom Name</div>
                <div className='chatroomContent'>
                    <div className='message'>
                        <span className='otherMessage'>Keisay:</span> Hello Guys
                    </div>
                    <div className='message'>
                        <span className='ownMessage'>Apino:</span> Hi Keisay
                    </div>
                </div>
                <div className='chatroomActions'>
                    <div>
                        <input type='text' name='message' placeholder='Say something!' />
                    </div>
                    <div>
                        <button className='join'>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ChatroomPage)