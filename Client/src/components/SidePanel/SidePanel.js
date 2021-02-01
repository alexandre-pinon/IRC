import React from 'react'
import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessages from './DirectMessages'
import Starred from './Starred'
import { Menu } from 'semantic-ui-react'

class SidePanel extends React.Component {
    constructor(props) {
        super(props)
        this.channelsComponent = React.createRef()
    }
    state = {
        channels: [],
    }

    handleChannels = (channels) => {
        this.setState({channels: channels})
    }
    handleActivateChannel = (channel) => {
        this.channelsComponent.current.activateChannel(channel)
    }

    render() {
        return (
            <Menu
                size='large'
                inverted
                fixed='left'
                vertical
                style={{ background: '#4c3c4c', fontsize: '1.2rem' }}
            >
                <UserPanel
                    history={this.props.history}
                    socket={this.props.socket}
                    username={this.props.username}
                />
                <Starred />
                <Channels
                    callBackActivateChannel = {this.props.callBackActivateChannel}
                    callBackHandleChannels = {this.handleChannels}
                    socket={this.props.socket}
                    ref={this.channelsComponent}
                />
                <DirectMessages 
                    channels={this.state.channels}
                    callBackActivateChannel = {this.handleActivateChannel}
                />
            </Menu>
        )
    }
}

export default SidePanel