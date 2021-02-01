import React from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Icon } from 'semantic-ui-react'

class DirectMessages extends React.Component {
    
    render() {

        return (
            <React.Fragment>
                <Menu.Menu className='menu'>
                    <Menu.Item>
                        <span>
                            <Icon name='mail' /> DIRECT MESSAGES
                        </span> {' '}
                    </Menu.Item>
                    {/* Users to Send Direct Messages */}

                    
                    { this.props.channels ? this.props.channels.map(channel => {
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
                                    @ {channel.name}
                                </Menu.Item>
                            )
                        }
                        return ''
                    }) : ''}


                    {/* <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name='circle'
                            color={'red'}
                        />
                        @ {'Keisay'}
                    </Menu.Item>
                    
                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name='circle'
                            color={'green'}
                        />
                        @ {'Wilfrère'}
                    </Menu.Item>

                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name='circle'
                            color={'red'}
                        />
                        @ {'BryanCurry'}
                    </Menu.Item>

                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name='circle'
                            color={'green'}
                        />
                        @ {'UmaSimp'}
                    </Menu.Item> */}
                    
                </Menu.Menu>
            </React.Fragment>
        )
    }
}

export default DirectMessages