import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'

class MessagesHeader extends React.Component {
    render() {

        const { handleStar, isChannelStarred, activeChannel } = this.props

        return (
            <Segment clearing>
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
                    <span>
                        {activeChannel?.name}
                        <Icon 
                            onClick={handleStar}
                            name={isChannelStarred ? 'star' : 'star outline'} 
                            color='yellow' />
                    </span>
                    <Header.Subheader>
                        {
                            activeChannel?.users.length === 1
                                ? '1 User'
                                : `${activeChannel?.users.length} Users`
                        }
                    </Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated='right'>
                    <Menu.Item>
                        <Icon
                            name='edit outline'
                            color='violet' />
                        <div></div>
                        <Icon
                            //onClick={...}
                            name='sign-out'
                            color='violet' />
                        <div></div>
                        <Icon
                            name='trash alternate outline'
                            color='violet' />
                        {/*
                        <Input
                            size='mini'
                            icon='search'
                            name='searchTerm'
                            placeholder='Search Messages'
                        />
                        */}
                    </Menu.Item>
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader