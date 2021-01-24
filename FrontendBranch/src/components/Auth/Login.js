import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'


class Login extends React.Component {
    state = {
        email: '',
        password: '',
        loading: false
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        this.setState({ loading: true })
        event.preventDefault()
        const { email, password } = this.state
        axios
            .post('http://localhost:8000/user/login', {
                email,
                password
            })
            .then((response) => {
                this.setState({ email: '', password: '', loading: false })
                const { message, token, username } = response.data
                makeToast('success', message)
                sessionStorage.setItem('CC_Token', token)
                sessionStorage.setItem('username', username)
                this.props.history.push('/')
            })
            .catch((error) => {
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    this.setState({
                        password: '',
                        loading: false
                    })
                    makeToast('error', error.response.data.message)
                }
            })
    }

    render() {
        const { email, password, loading } = this.state

        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' icon color='purple' textAlign='center'>
                        <Icon name='chat' color='purple' />
                        Login for PlooV4
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                        <Segment stacked>
                            <Form.Input 
                                fluid name='email'
                                icon='mail'
                                iconPosition='left'
                                placeholder='Email'
                                onChange={this.handleChange}
                                value={email}
                                type='email'
                                required
                            />
                            <Form.Input
                                fluid name='password'
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                onChange={this.handleChange}
                                value={password}
                                type='password'
                                required
                            />
                            <Button 
                                disabled={loading}
                                className={loading ? 'loading' : ''} color='purple'
                                fluid size='large'
                            >
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Don't have an account?
                        <Link to='/register'> Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login