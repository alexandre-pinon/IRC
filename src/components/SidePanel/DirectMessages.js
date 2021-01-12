import React from 'react';
import { useParams } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

class DirectMessages extends React.Component {
    
    render() {

        return (
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="mail" /> DIRECT MESSAGES
                        </span> {" "}
                    </Menu.Item>
                    {/* Users to Send Direct Messages */}

                    
                    {/*users.map(user => (
                        <Menu.Item
                            key={user.uid}
                            onClick={() => console.log(user)}
                            style={{ opacity: 0.7, fontStyle: 'italic' }}
                        >
                            <Icon
                                name="circle"
                                color={this.isUserOnline(user) ? 'green' : 'red'}
                            />
                            @ {user.name}
                        </Menu.Item>
                    ))*/}


                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name="circle"
                            color={"red"}
                        />
                        @ {"Keisay"}
                    </Menu.Item>
                    
                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name="circle"
                            color={"green"}
                        />
                        @ {"Wilfrère"}
                    </Menu.Item>

                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name="circle"
                            color={"red"}
                        />
                        @ {"BryanCurry"}
                    </Menu.Item>

                    <Menu.Item
                        style={{ opacity: 1.0, fontStyle: 'italic' }}
                    >
                        <Icon
                            name="circle"
                            color={"green"}
                        />
                        @ {"UmaSimp"}
                    </Menu.Item>
                    
                </Menu.Menu>
            </React.Fragment>
        )
    }
}

export default DirectMessages;