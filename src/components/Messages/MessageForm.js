import React from 'react';
import FileModal from './FileModal';
import { Segment, Button, Input } from 'semantic-ui-react'
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

class Messageform extends React.Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        emojiPicker: false
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

    handleTogglePicker = () => {
        this.setState({ emojiPicker: !this.state.emojiPicker });
    }

    handleAddEmoji = emoji => {
        const oldMessage = this.state.message;
        const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
        this.setState({ message: newMessage, emojiPicker: false });
      };
    
      colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
          x = x.replace(/:/g, "");
          let emoji = emojiIndex.emojis[x];
          if (typeof emoji !== "undefined") {
            let unicode = emoji.native;
            if (typeof unicode !== "undefined") {
              return unicode;
            }
          }
          x = ":" + x + ":";
          return x;
        });
      };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {

        const { errors, message, loading, modal, emojiPicker } = this.state;

        return (
            <Segment className="message__form">
                {emojiPicker && (
                    <Picker
                        set="apple"
                        onSelect={this.handleAddEmoji}
                        className="emojipicker"
                        title="Pick your emoji"
                        emoji="point_up"
                    />
                )}
                <Input
                    fluid
                    name="message"
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    value={message}
                    label={
                    <Button
                        icon={emojiPicker ? "close" : "add"}
                        content={emojiPicker ? "Close" : null}
                        onClick={this.handleTogglePicker}
                    />
                    }                    
                    labelPosition="left"
                    placeholder="Write your message"
                />

                <Button.Group icon widths="2">
                    <Button
                        color="yellow"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                        color="blue"
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
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

export default Messageform;