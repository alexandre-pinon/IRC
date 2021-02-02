import axios from 'axios'
import React from 'react'
import { Header, Segment, Input, Icon, Button, Form, Modal, Menu } from 'semantic-ui-react'
import { makeConfirm, makeToast } from '../Toaster'


class MessagesHeader extends React.Component {

    state = {
        modal: false,
        newChannelName: ''
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => {
        this.setState({ modal: false, newChannelName: '' })
    }

    handleSubmit = event => {
        event.preventDefault()
        this.editChannelName()
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    editChannelName = async () => {
        try {
            const data = {
                chatroomId: this.props.activeChannel._id,
                newName: this.state.newChannelName,
            }
            const headers = {
                Authorization:
                    'Bearer ' +
                    sessionStorage.getItem('CC_Token')
            }
            const response = await axios.put(
                'http://localhost:8000/chatroom/edit',
                data,
                { headers: headers }
            )
            this.props.socket.emit('refreshChannels')
            makeToast('success', response.data.message)
        } catch (error) {
            if (error.response?.data?.message) {
                makeToast('error', error.response.data.message)
            }
        }
        this.closeModal()
    }

    quit = async () => {
        const confirm = await makeConfirm('warning', `Are you sure to leave ${this.props.activeChannel.name} ?`)
        if (confirm && this.props.socket) {
            this.props.socket.emit('chatroomMessage', {
                chatroomId: this.props.activeChannel._id,
                message: `/quit ${this.props.activeChannel.name}`
            })
        }
    }

    delete = async () => {
        const confirm = await makeConfirm('warning', `Are you sure to DELETE ${this.props.activeChannel.name} ?`)
        if (confirm && this.props.socket) {
            this.props.socket.emit('chatroomMessage', {
                chatroomId: this.props.activeChannel._id,
                message: `/delete ${this.props.activeChannel.name}`
            })
        }
    }

    render() {

        const { handleStar, isChannelStarred, activeChannel } = this.props
        const { modal } = this.state

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
                {/* <Header floated='right'>
                        <Icon
                            name='edit outline'
                            onClick={this.openModal}
                            color='violet' />
                        <Icon
                            //onClick={...}
                            name='sign-out'
                            color='violet' />
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
                        
                </Header> */}
                <Header floated='right'>
                    <Icon
                        name='trash alternate outline'
                        onClick={this.delete}
                        color='red'
                    />
                </Header>
                <Header floated='right'>
                    <Icon
                        name='big sign-out'
                        onClick={this.quit}
                        color='violet' />
                </Header>
                <Header floated='right'>
                    <Icon
                        name='edit outline'
                        onClick={this.openModal}
                        color='violet'
                    />
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
                                name='newChannelName'
                                onChange={this.handleChange} 
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