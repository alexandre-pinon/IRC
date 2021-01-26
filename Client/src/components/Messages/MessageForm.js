import React from 'react'
import FileModal from './FileModal'
import { Segment, Button, Input } from 'semantic-ui-react'
import { Picker, emojiIndex } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

class Messageform extends React.Component {
    state = {
        newMessage: '',
        errors: [],
        modal: false,
        emojiPicker: false
    }

    sendMessage = () => {
        if (this.props.socket) {
            this.props.socket.emit('chatroomMessage', {
                chatroomId: this.props.activeChannel._id,
                message: this.state.newMessage
            })
            this.setState({ newMessage: '' })
        } else {
            console.log('Error : NO SOCKET!')
        }
    }

    handleKeyDown = event => {
        this.setState({ [event.target.name]: event.target.value })
        if (event.keyCode === 13) {
            this.sendMessage();
        }
    }

    handleSubmit = event => {
        event.preventDefault()
        this.sendMessage()
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
      }

    handleTogglePicker = () => {
        this.setState({ emojiPicker: !this.state.emojiPicker })
    }

    handleAddEmoji = emoji => {
        const oldMessage = this.state.newMessage
        const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `)
        this.setState({ newMessage: newMessage, emojiPicker: false })
      }
    
      colonToUnicode = newMessage => {
        return newMessage.replace(/:[A-Za-z0-9_+-]+:/g, x => {
          x = x.replace(/:/g, '')
          let emoji = emojiIndex.emojis[x]
          if (typeof emoji !== 'undefined') {
            let unicode = emoji.native
            if (typeof unicode !== 'undefined') {
              return unicode
            }
          }
          x = ':' + x + ':'
          return x
        })
      }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })

    render() {

        const { newMessage, errors, modal, emojiPicker } = this.state

        return (
            <Segment className='message__form'>
                {emojiPicker && (
                    <Picker
                        set='apple'
                        onSelect={this.handleAddEmoji}
                        className='emojipicker'
                        title='Pick your emoji'
                        emoji='point_up'
                    />
                )}
                <Input
                    fluid
                    name='newMessage'
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    style={{ marginBottom: '0.7em' }}
                    value={newMessage}
                    label={
                    <Button
                        icon={emojiPicker ? 'close' : 'add'}
                        content={emojiPicker ? 'Close' : null}
                        onClick={this.handleTogglePicker}
                    />
                    }                    
                    labelPosition='left'
                    placeholder='Write your message'
                />

                <Button.Group icon widths='2'>
                    <Button
                        color='yellow'
                        onClick={this.handleSubmit}
                        content='Send'
                        labelPosition='left'
                        icon='edit'
                    />
                    <Button
                        color='blue'
                        onClick={this.openModal}
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default Messageform