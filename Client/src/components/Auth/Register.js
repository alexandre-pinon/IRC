import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { makeToast } from '../Toaster'


class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        error: '',
        loading: false
    }

    isPasswordValid = (password, passwordConfirmation) => {
        if (password !== passwordConfirmation) {
            this.setState({ error: 'Passwords are different!' }, () => {
                makeToast('error', this.state.error)
                this.setState({
                    password: '',
                    passwordConfirmation: '',
                    error: '',
                    loading: false
                })
            })
        } else {
            return true
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = async event => {
        this.setState({ loading: true })
        event.preventDefault()
        const { username, email, password, passwordConfirmation } = this.state
        if (this.isPasswordValid(password, passwordConfirmation)) {
            try {
                const response = await axios.post(
                    'http://localhost:8000/user/register',
                    {
                        name: username,
                        email,
                        password
                    }
                )
                this.setState({
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirmation: '',
                    error: '',
                    loading: false
                })
                makeToast('success', response.data.message)
                sessionStorage.setItem('CC_Token', response.data.token)
                this.props.history.push('/login')
            } catch (error) {
                if (error.response?.data?.message) {
                    this.setState({
                        password: '',
                        passwordConfirmation: '',
                        error: '',
                        loading: false
                    })
                    makeToast('error', error.response.data.message)
                }
            }
        }
    }

    render() {
        const { username, email, password, passwordConfirmation, loading } = this.state

        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' icon color='blue' textAlign='center'>
                        <Icon name='chat' color='blue' />
                        Register for PlooV4
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                        <Segment stacked>
                            <Form.Input 
                                fluid name='username'
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                onChange={this.handleChange}
                                value={username}
                                type='text'
                                required
                            />
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
                            <Form.Input
                                fluid name='passwordConfirmation'
                                icon='repeat'
                                iconPosition='left'
                                placeholder='Password Confirmation'
                                onChange={this.handleChange}
                                value={passwordConfirmation}
                                type='password'
                                required
                            />
                            <Button
                                disabled={loading}
                                className={loading ? 'loading' : ''} color='blue'
                                fluid size='large'
                            >
                                Register
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Already a user?
                        <Link to='/login'> Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register