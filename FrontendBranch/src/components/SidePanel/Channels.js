import axios from 'axios'
import React, { useReducer } from 'react'
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react'

class Channels extends React.Component {
    state = {
        channels: [],
        channelName: '',
        activeChannel: null,
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
            if (response.data.length > 0) {
                const defaultActiveChannel = response.data[0]
                this.props.callBackActivateChannel(defaultActiveChannel)
                this.setState({
                    channels: response.data,
                    activeChannel: defaultActiveChannel
                }, () => {
                    if (this.props.socket) {
                        this.props.socket.emit('joinRoom', {
                            chatroomId: this.state.activeChannel._id
                        })
                    }
                })
            }
            
        } catch (error) {
            // setTimeout(this.getChannels, 3000)
            console.log('Error retrieving Channels!', error)
        }
    }

    componentDidMount() {
        this.getChannels()
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.socket &&
            prevState.activeChannel &&
            prevState.activeChannel._id !== this.state.activeChannel._id
        ) {
            this.props.socket.emit('leaveRoom', {
                chatroomId: prevState.activeChannel._id
            })
            this.props.socket.emit('joinRoom', {
                chatroomId: this.state.activeChannel._id
            })
        }
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

    activateChannel = channel => {
        this.props.callBackActivateChannel(channel)
        this.setState({ activeChannel: channel })
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
                    key={channel._id}
                    onClick={() => this.activateChannel(channel)}
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