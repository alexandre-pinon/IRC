import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button, Form } from 'semantic-ui-react'
import { makeToast } from '../Toaster'
import defaultProfilePic from '../../ressources/default-profile-picture.jpg'

class UserPanel extends React.Component {
    state = {
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        newUsername: '',
    }

    changeUsername = () => {
        if (this.props.socket) {
            this.props.socket.emit('chatroomMessage', {
                chatroomId: this.props.activeChannel._id,
                message: `/nick ${this.state.newUsername}`
            })
            this.closeModal()
        } else {
            console.log('Error : NO SOCKET!')
        }
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false, newUsername: '' })


    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>User</strong></span>,
            disabled: true
        },
        {
            key: 'nickname',
            text: <span onClick={this.openModal}>Change Username</span>
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            ket: 'signout',
            text: <span onClick={this.handleSignout}>Log Out</span>
        }
    ]

    handleChange = event => {
        const file = event.target.files[0]
        const reader = new FileReader()

        if (file) {
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result })
            })
        }
    }

    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob)
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    }

    handleSubmit = event => {
        event.preventDefault()
        this.changeUsername()
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSignout = () => {
        this.props.socket?.disconnect()
        makeToast('error', 'Socket Disconnected!')
        sessionStorage.removeItem('CC_Token')
        this.props.history.push('/login')
    }

    componentDidMount() {

    }

    render() {
        const { modal, previewImage, croppedImage } = this.state

        return (
            
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        { /* App Header */ }
                        <Header inverted floated='left' as='h2'>
                            <Icon name='comment alternate outline' />
                            <Header.Content>PlooV4</Header.Content>
                        </Header>
                    </Grid.Row>

                    { /* User Dropdown */ }
                    <Header style={{ padding: '0.25em' }} as='h4' inverted>
                        <Dropdown 
                        trigger={
                            <span>
                                <Image src={defaultProfilePic} spaced='right' avatar />
                                {/* <Image src={'https://avatarfiles.alphacoders.com/259/thumb-1920-259754.png'} spaced='right' avatar /> */}
                                {this.props.username}
                            </span>
                        } options={this.dropdownOptions()} />
                    </Header>


                    {/* Change User Avatar Modal */}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Username</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Field>
                                    <Input
                                        fluid
                                        label='New Username'
                                        name='newUsername'
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

                            {/*
                            <Input
                                onChange={this.handleChange}
                                fluid
                                type='file'
                                label='New Avatar'
                                name='previewImage'
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className='ui center aligned grid'>
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: '3.5em auto' }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                                        */}
                        </Modal.Content>
                        <Modal.Actions>

                            <Button color='green' inverted onClick={this.handleSubmit}>
                            <Icon name='checkmark' /> Change Username
                            </Button>

                            <Button color='red' inverted onClick={this.closeModal}>
                                <Icon name='remove' /> Cancel
                            </Button>

                            {/*
                            {croppedImage && <Button color='green' inverted>
                                <Icon name='save' /> Change Avatar
                            </Button>}

                            <Button color='green' inverted onClick={this.handleCropImage}>
                                <Icon name='image' /> Preview
                            </Button>

                            <Button color='red' inverted onClick={this.closeModal}>
                                <Icon name='remove' /> Cancel
                            </Button>
                            */}

                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel