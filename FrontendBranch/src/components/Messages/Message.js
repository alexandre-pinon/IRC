import React from 'react'
import { Comment, Image } from 'semantic-ui-react'

/*
const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : ''
}
*/


/*
const timeFromNow = timestamp => moment(timestamp).fromNow()
*/ 

const Message = ({ message, user }) => (
    <Comment>
        <Comment.Avatar src={'https://avatarfiles.alphacoders.com/259/thumb-1920-259754.png'} />
        <Comment.Content className='message__self'>
            <Comment.Author as='a'>{'Apino'}</Comment.Author>
            <Comment.Text>{'I\'m playing Genshin Impact everyday!'}</Comment.Text>
        </Comment.Content>

        <Comment.Avatar src={'https://avatarfiles.alphacoders.com/228/228327.jpg'} />
        <Comment.Content className='message__self'>
            <Comment.Author as='a'>{'Keisay'}</Comment.Author>
            <Comment.Text>{'That\'s cool bro, I prefer to play The Last Of Us, the story is better!'}</Comment.Text>
        </Comment.Content>

        <Comment.Avatar src={'https://i1.sndcdn.com/avatars-000343843765-qob6an-t500x500.jpg'} />
        <Comment.Content className='message__self'>
            <Comment.Author as='a'>{'Wilfrère'}</Comment.Author>
            <Comment.Text>{'.'}</Comment.Text>
        </Comment.Content>

        <Comment.Avatar src={'https://manderson.site/yote/img/curry.jpg'} />
        <Comment.Content className='message__self'>
            <Comment.Author as='a'>{'BryanCurry'}</Comment.Author>
            <Comment.Text>{'Gotaga is the King of Twitch!'}</Comment.Text>
        </Comment.Content>

        <Comment.Avatar src={'https://avatarfiles.alphacoders.com/807/80701.jpg'} />
        <Comment.Content className='message__self'>
            <Comment.Author as='a'>{'UmaSimp'}</Comment.Author>
            <Comment.Text>{'Hey guys, check this streamer!'}</Comment.Text>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Image src={'https://pbs.twimg.com/media/Elh-MiTVcAAy3l2.jpg'} className='message__image' />
        </Comment.Content>

    </Comment>
)

export default Message