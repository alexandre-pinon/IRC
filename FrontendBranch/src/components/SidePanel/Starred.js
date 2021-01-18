import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

class Starred extends React.Component {
    state = {
        starredChannels: [],
    }

    render() {
        const { starredChannels, modal } = this.state
        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='star' /> STARRED
                    </span> {' '}
                    ({ starredChannels.length })
                </Menu.Item>
            </Menu.Menu>
        )
    }
}

export default Starred