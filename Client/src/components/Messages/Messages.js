import React from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import Typing from './Typing'
import { Segment, Comment } from 'semantic-ui-react'
import axios from 'axios'
import makeToast from '../Toaster'

class Messages extends React.Component {

    state = {
        isChannelStarred: false,
        messages: [],
    }

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel()) 
    }

    handleMessages = () => {
        if (this.props.socket) {
            this.props.socket.on('newMessage', (message) => {
                this.setState({ messages:[...this.state.messages, message] })
            })
            this.props.socket.on('ok', (response) => {
                makeToast('success', response.message)
            })
            this.props.socket.on('error', (response) => {
                makeToast('error', response.error)
            })
            this.props.socket.on('nick', (response) => {
                this.setUsername(response.newName)
                sessionStorage.setItem('username', response.newName)
                this.getMessages()
            })
        }
    }

    starChannel = () => {
        if (this.state.isChannelStarred) {
            console.log('star')
        } else {
            console.log('unstarred')
        }
    }

    getMessages = async () => {
        try {
            const data = {
                chatroomId: this.props.activeChannel._id,
            }
            const headers = {
                Authorization:
                    'Bearer ' +
                    sessionStorage.getItem('CC_Token')
            }
            const response = await axios.post(
                'http://localhost:8000/message',
                data,
                { headers: headers }
            )
            this.setState({ messages: response.data })
        } catch (error) {
            // setTimeout(this.getChannels, 3000)
            console.log('Error retrieving Messages!', error)
        }
    }

    componentDidMount() {
        if (this.props.activeChannel) {this.getMessages()}
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.activeChannel &&
            prevProps.activeChannel !== this.props.activeChannel
        ) {
            this.getMessages()
        }
        if (prevProps.socket !== this.props.socket) {
            this.handleMessages()
        }
        if (this.messages) {
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.removeAllListeners();
        }
    }

    setUsername = (newName) => {
        this.props.callBackSetUsername(newName)
    }

    scrollToBottom = () => {
        this.messages.scrollIntoView({ behavior: 'smooth' });
    }
    
    render() {

        const { isChannelStarred, messages } = this.state
        return (
            <React.Fragment>
                <MessagesHeader 
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                    activeChannel = {this.props.activeChannel}
                />
                
                <Segment>
                    <Comment.Group className='messages'>
                        {messages.map((message, key) => (
                            <Message
                                key = {key}
                                message = {message.message}
                                username = {message.name}
                            />
                        ))}
                        {/* Messages
                        <Message />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className='user__typing'>
                                Apino is typing
                            </span>
                            <Typing />
                        </div> */}
                        <div ref={node => (this.messages = node)}></div>
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    activeChannel = {this.props.activeChannel}
                    socket = {this.props.socket}
                />
            </React.Fragment>
        )
    }
}

export default Messages