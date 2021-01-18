import React from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import Typing from './Typing'
import { Segment, Comment } from 'semantic-ui-react'

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

    /*
    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )
    */
    
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
                            <span className='user__typing'>Apino is typing</span> <Typing />
                        </div>
                    </Comment.Group>
                </Segment>

                <MessageForm />
            </React.Fragment>
        )
    }
}

export default Messages