import React from 'react'
import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessages from './DirectMessages'
import Starred from './Starred'
import { Menu } from 'semantic-ui-react'

class SidePanel extends React.Component {
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
                />
                <Starred />
                <Channels
                    callBackActivateChannel = {
                        this.props.callBackActivateChannel
                    }
                    socket={this.props.socket}
                />
                <DirectMessages />
            </Menu>
        )
    }
}

export default SidePanel