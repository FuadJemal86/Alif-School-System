import React from 'react'
import './loginCss/login.css'

function Login() {
    return (
        <div>
            <div className='Login-container'>
                <div className='Login-container1'>
                    <div>
                        <div className='login-text'>Login</div>
                        <div className='Login-container2'>
                            <div className='login-input'>
                                <input
                                    type='email'
                                    placeholder='Email'
                                />
                            </div>
                            <div className='login-input'>
                                <input
                                    type='password'
                                    placeholder='Password'
                                />
                            </div>
                        </div>
                        <div className='Login-button'>
                            <button>Login</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Login
