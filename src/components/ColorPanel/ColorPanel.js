import React from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Label, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SliderPicker, TwitterPicker, GithubPicker } from 'react-color';

class ColorPanel extends React.Component {
    state = {
        modal: false,
        primary: '',
        secondary: ''
    }

    handleChangePrimary = color => this.setState({ primary: color.hex });

    handleChangeSecondary = color => this.setState({ secondary: color.hex });

    
    displayUserColors = colors => (
        colors.length > 0 && colors.map((color, i) => (
            <React.Fragment key={i}>
                <Divider />
                <div 
                    className="color__container"
                    onClick={() => this.props.setColors(color.primary, color.secondary)}
                >
                    <div className="color__square" style={{ background: color.primary}}>
                        <div className="color__overlay" style={{ background: color.secondary}}>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        ))
    )
    
    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });


    render() {
        const { modal, primary, secondary } = this.state;
        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button icon="add" size="medium" color="blue" onClick={this.openModal} />
                <Divider />
                <a href="https://www.youtube.com/" target="_blank">
                    <Button icon="youtube" size="medium" color="red" />
                </a>
                <Divider />
                <a href='https://lichess.org/' target="_blank" >
                    <Button icon="chess" size="medium" color="brown" />
                </a>
                

                {/* Color Picker Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                        <Label content="Primary Color" />
                        <TwitterPicker
                            color={primary}
                            onChange={this.handleChangePrimary} />
                        </Segment>

                        <Segment inverted>
                        <Label content="Secondary Color" />
                        <TwitterPicker
                            color={secondary}
                            onChange={this.handleChangeSecondary}/>
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>

                        <Button color="green" inverted>
                            <Icon name="checkmark" /> Save Colors
                        </Button>

                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default ColorPanel;