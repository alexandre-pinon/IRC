import React from 'react'
import { Grid } from 'semantic-ui-react'
import './App.css'

import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import { makeToast } from './Toaster'
import io from 'socket.io-client'

const App = (props) => {
  const [socket, setSocket] = React.useState(null)
  const [activeChannel, setActiveChannel] = React.useState(null)
  const [username, setUsername] = React.useState(
    sessionStorage.getItem('username')
  )
  const setupSocket = (token) => {
    if (!socket) {
      const newSocket = io('http://localhost:8000', {
        query: {
            token: token
        }
      })
    
      newSocket.on('disconnect', () => {
        makeToast('error', 'Socket Disconnected!')
        setSocket(null)
      })

      newSocket.on('connect', () => {
        makeToast('success', 'Socket Connected!')
      })

      setSocket(newSocket)
    }
  }

  React.useEffect(() => {
    const token = sessionStorage.getItem('CC_Token')
    if (!token) {
      props.history.push('/login')
    } else {
      setupSocket(token)
    }
    // eslint-disable-next-line
  }, [])

  const handleActivateChannel = (channel) => {
    setActiveChannel(channel)
  }
  const handleSetUsername = (newName) => {
    setUsername(newName)
  }
  

  return (
    <Grid columns='equal' className='app' style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel 
        history={props.history}
        callBackActivateChannel = {handleActivateChannel}
        socket={socket}
        username={username}
        activeChannel = {activeChannel}
      />

      <Grid.Column style = {{ marginLeft: 320 }}>
        <Messages
          history={props.history}
          callBackSetUsername = {handleSetUsername}
          socket = {socket}
          activeChannel = {activeChannel}
          username={username}
        />
      </Grid.Column>

      <Grid.Column width = {4}>
        <MetaPanel />
      </Grid.Column>
      
    </Grid>
  )
}

export default App
