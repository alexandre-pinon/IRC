import axios from 'axios'
import React, { useReducer } from 'react'
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react'
import makeToast from '../Toaster'

class Channels extends React.Component {
    state = {
        channels: [],
        channelName: '',
        activeChannel: null,
        modalJoin: false,
        modalAdd: false
    }

    getUserChannels = async () => {
        try {
            const token = sessionStorage.getItem('CC_Token')
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.get(
                'http://localhost:8000/chatroom/' + payload?.id,
                { headers: headers }
            )
            if (response.data.length > 0) {
                const defaultActiveChannel = response.data[0]
                this.setState({
                    channels: response.data,
                }, () => {
                    const { channels, activeChannel} = this.state
                    const wrongActiveChannel = !channels.some(
                            channel => channel?.name === activeChannel?.name
                    )
                    if (wrongActiveChannel) {
                        this.activateChannel(defaultActiveChannel)
                    }
                    this.props.socket?.emit('channels refreshed')
                })
            }
        } catch (error) {
            // setTimeout(this.getUserChannels, 3000)
            console.log('Error retrieving Channels!', error)
        }
    }

    initSocket = () => {
        this.props.socket?.on('refresh channels', () => {
            this.getUserChannels()
        })
        this.props.socket?.on('activate channel', (response) => {
            this.activateChannel(response.chatroom)
        })
    }

    componentDidMount() {
        this.getUserChannels()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.socket !== this.props.socket) {
            this.initSocket()
        }
        if (
            prevState.activeChannel &&
            prevState.activeChannel._id !== this.state.activeChannel._id
        ) {
            this.props.socket?.emit('leaveRoom', {
                chatroomId: prevState.activeChannel._id
            })
            this.props.socket?.emit('joinRoom', {
                chatroomId: this.state.activeChannel._id
            })
        } else if (
            !prevState.activeChannel &&
            prevState.activeChannel !== this.state.activeChannel
        ) {
            this.props.socket?.emit('joinRoom', {
                chatroomId: this.state.activeChannel._id
            })
        }
    }

    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.removeAllListeners();
        }
    }

    addChannel = async () => {
        try {
            const token = sessionStorage.getItem('CC_Token')
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null
            const data = {
                name: this.state.channelName,
                userId: payload.id
            }
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.post(
                'http://localhost:8000/chatroom/create',
                data,
                { headers: headers }
            )
            makeToast('success', response.data.message)
            await this.getUserChannels()
            this.activateChannel(response.data.chatroom)
        } catch (error) {
            if (error.response?.data?.message) {
                makeToast('error', error.response.data.message)
            } else {
                makeToast('error', 'Internal Server Error')
                console.log(error)
            }
        }
        this.closeModal()
    }

    isFormValid = () => this.state.channelName.trim() ? true : false

    handleSubmit = event => {
        event.preventDefault()
        this.isFormValid()
            ? this.addChannel()
            : makeToast('error', 'Channel name is empty!')
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    activateChannel = channel => {
        this.props.callBackActivateChannel(channel)
        this.setState({ activeChannel: channel })
    }

    openModalJoin = () => this.setState({ modal: true })
    openModalAdd = () => this.setState({ modal: true })

    closeModalJoin = () => {
        this.setState({ modal: false, channelName: '' })
    }

    closeModalAdd = () => {
        this.setState({ modal: false, channelName: '' })
    }

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
                    <Icon name='add' onClick={this.openModalAdd} />
                    <Icon name='arrow alternate circle right outline' onClick={this.openModalJoin} />
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
            <Modal basic open={modalAdd} onClose={this.closeModalAdd}>
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
                        <Icon name='checkmark' /> Add
                    </Button>

                    <Button color='red' inverted onClick={this.closeModalAdd}>
                        <Icon name='remove' /> Cancel
                    </Button>

                </Modal.Actions>
            </Modal>

            <Modal open={modalJoin} onClose={this.closeModalJoin}>
                <Modal.Header>Join a Channel</Modal.Header>
                <Modal.Content>
                    {/*
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                label='Name of Channel'
                                name='channelName'
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
                        </Form.Field> 
                        </Form> */}
                </Modal.Content>

                <Modal.Actions>

                    <Button color='green' inverted onClick={this.handleSubmit}>
                        <Icon name='checkmark' /> Join
                    </Button>

                    <Button color='red' inverted onClick={this.closeModalJoin}>
                        <Icon name='remove' /> Cancel
                    </Button>

                </Modal.Actions>
            </Modal>

            </React.Fragment>
    
        )
    }
}

export default Channels