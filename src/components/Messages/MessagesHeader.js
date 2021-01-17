import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    render() {
        const {
            handleStar,
            isChannelStarred
        } = this.props;


        return (
            <Segment clearing>
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        Genshin Impact
                        <Icon 
                            onClick={handleStar}
                            name={isChannelStarred ? 'star' : 'star outline'} 
                            color="yellow" />
                    </span>
                    <Header.Subheader>5 Users</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                    />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;