import axios from 'axios'
import React, { useReducer } from 'react'
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react'

class Channels extends React.Component {
    state = {
        channels: [],
        channelName: '',
        modal: false
    }

    getChannels = async () => {
        try {
            const response = await axios.get('http://localhost:8000/chatroom', {
                headers: {
                    Authorization:
                        'Bearer ' +
                        sessionStorage.getItem('CC_Token')
                }
            })
            this.setState({ channels: response.data })
        } catch (error) {
            setTimeout(this.getChannels, 3000)
            console.log('Error retrieving Channels!', error)
        }
    }

    componentDidMount() {
        this.getChannels()
    }

    addChannel = () => {

    }

    handleSubmit = event => {
        event.preventDefault()
        this.addChannel()
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    changechannel = channel => {

    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })


    render() {
        const { channels, modal } = this.state

        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> CHANNELS
                    </span> {' '}
                    ({ channels ? channels.length : 0 })
                    <Icon name='add' onClick={this.openModal} />
                </Menu.Item>
                {/* Channels */}
                {/* this.displayChannels(channels) */}

                {/* Example Channel 1 */}
                { channels ? channels.map(channel => (
                    <Menu.Item
                    onClick={() => console.log('This is a channel')}
                    style={{ opacity: 1.0 }}
                >
                    {channel.name}
                </Menu.Item>
                )) : ''}
            </Menu.Menu>

            {/* Add Channel Modal */}
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>

                        <Form.Field>
                            <Input
                                fluid
                                label='Name of Channel'
                                name='channelName'
                                onChange={this.handleChange} 
                            />
                        </Form.Field>

                        <Form.Field>
                            <Input
                                fluid
                                label='About the Channel'
                                name='channelDetails'
                                onChange={this.handleChange} 
                            />
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>

                    <Button color='green' inverted onClick={this.handleSubmit}>
                        <Icon name='checkmark' /> Add
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

export default Channels