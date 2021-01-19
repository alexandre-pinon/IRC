import React from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import Typing from './Typing'
import { Segment, Comment } from 'semantic-ui-react'
import axios from 'axios'

class Messages extends React.Component {

    state = {
        isChannelStarred: false,
    }

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel()) 
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
            const data = { chatroomId: this.props.activeChannel._id }
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
            // this.setState({ channels: response.data })
            console.log(response.data)
        } catch (error) {
            // setTimeout(this.getChannels, 3000)
            console.log('Error retrieving Messages!', error)
        }
    }

    componentDidMount() {
        if (this.props.activeChannel) {this.getMessages()}
    }

    componentDidUpdate() {
        if (this.props.activeChannel) {this.getMessages()}
    }
    
    render() {

        const { isChannelStarred } = this.state
        return (
            <React.Fragment>
                <MessagesHeader 
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}

                />
                
                <Segment>
                    <Comment.Group className='messages'>
                        {/* Messages */}
                        <Message />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className='user__typing'>
                                Apino is typing
                            </span>
                            <Typing />
                        </div>
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