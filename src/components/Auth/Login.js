import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false
    };

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid()) {
            error = { message: 'Password is invalid' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            // form valid
            return true;
        }
    };

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length ||
        !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true });
        }
    };

    render() {
        const { email, password, errors, loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="purple" textAlign="center">
                        <Icon name="chat" color="purple" />
                        Login for PlooV4
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Email" onChange={this.handleChange} value={email} className={errors.some(error => error.message.toLowerCase().includes('email')) ? 'error' : ''} type="email" required />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                            placeholder="Password" onChange={this.handleChange} value={password} type="password" />

                        
                            <Button disabled={loading} className={loading ? 'loading' : ''} color="purple" fluid size="large">Submit</Button>

                        </Segment>
                    </Form>
                    <Message>Don't have an account? <Link to="/register">Register</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;