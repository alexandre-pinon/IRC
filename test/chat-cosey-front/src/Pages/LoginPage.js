import React from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

const LoginPage = (props) => {
    const emailRef = React.createRef()
    const passwordRef = React.createRef()

    const loginUser = () => {
        const email = emailRef.current.value
        const password = passwordRef.current.value

        axios
            .post('http://localhost:8000/user/login', {
                email,
                password
            })
            .then((response) => {
                makeToast('success', response.data.message)
                localStorage.setItem('CC_Token', response.data.token)
                props.history.push('/dashboard')
            })
            .catch((error) => {
                if (error && error.response && error.response.data && error.response.data.message) {
                    makeToast('error', error.response.data.message)
                }
            })
    }

    return (
        <div className='card'>
            <div className='cardHeader'>Login</div>
            <div className='cardBody'>
                <div className='inputGroup'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='abc@example.com'
                        ref={emailRef}
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Your Password'
                        ref={passwordRef}
                    />
                </div>
                <button onClick={loginUser}>Login</button>
            </div>
        </div>
    )
}

export default LoginPage