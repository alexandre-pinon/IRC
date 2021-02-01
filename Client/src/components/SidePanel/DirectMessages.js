import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

class DirectMessages extends React.Component {
    
    render() {

        const { channels, username } = this.props

        return (
            <React.Fragment>
                <Menu.Menu className='menu'>
                    <Menu.Item>
                        <span>
                            <Icon name='mail' /> DIRECT MESSAGES
                        </span> {' '}
                        ({
                            channels
                                ? channels.reduce((acc, channel) => { 
                                        return acc + (channel.private ? 1 : 0)
                                }, 0)
                                : 0
                        })
                    </Menu.Item>
                    {/* Users to Send Direct Messages */}

                    
                    { channels ? channels.map(channel => {
                        if (channel.private) {
                            return (
                                <Menu.Item
                                    key={channel._id}
                                    onClick={() => this.props.callBackActivateChannel(channel)}
                                    style={{ opacity: 1.0, fontStyle: 'italic' }}
                                >
                                    <Icon
                                        name='circle'
                                        color={'green'}
                                    />
                                    @ {
                                        channel.users[0].name !== username 
                                            ? channel.users[0].name
                                            : channel.users[1].name
                                    }
                                </Menu.Item>
                            )
                        }
                        return ''
                    }) : ''}


                    {/* activeChannel 
                            ? activeChannel.private
                                ? activeChannel.users[0].name !== this.props.username
                                    ? activeChannel.users[0].name
                                    : activeChannel.users[1].name
                                : activeChannel.name
                            : 'No channel active' */}
                    
                </Menu.Menu>
            </React.Fragment>
        )
    }
}

export default DirectMessages