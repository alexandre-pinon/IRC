import React from 'react'
import { Header, Segment, Input, Icon, Button, Form, Modal } from 'semantic-ui-react'

class MessagesHeader extends React.Component {

    state = {
        modal: false
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => {
        this.setState({ modal: false })
    }

    render() {

        const { handleStar, isChannelStarred, activeChannel } = this.props

        return (
            <React.Fragment>

            <Segment clearing>
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
                    <span>
                        {activeChannel 
                            ? activeChannel.private
                                ? activeChannel.users[0].name !== this.props.username
                                    ? activeChannel.users[0].name
                                    : activeChannel.users[1].name
                                : activeChannel.name
                            : 'No channel active'
                        }
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
                            onClick={this.openModal}
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

            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Edit the Channel Name</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                label='New Name'
                                //name='channelName'
                                //onChange={this.handleChange} 
                            />
                        </Form.Field>

                        {/* <Form.Field>
                            <Input
                                fluid
                                label='About the Channel'
                                name='channelDetails'
                                onChange={this.handleChange} 
                            />
                        </Form.Field> */}
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                
                    <Button color='green' inverted onClick={this.handleSubmit}>
                        <Icon name='checkmark' /> Edit
                    </Button>

                    <Button color='red' inverted onClick={this.closeModal}>
                        <Icon name='remove' /> Cancel
                    </Button>

                </Modal.Actions>
            </Modal>
            
            </React.Fragment>
        )
    }
}

export default MessagesHeader