import React from 'react'
import Logo from '../../logo/alif.png'
import '../loginHeader/loginHeader.css'
import { Link } from 'react-router-dom';

function LoginHeader() {
    return (
        <div className='main-header-container'>
            <div className='login-header'>
                <div className='login-header1'>
                    <div className='login-header-img'> <Link to={'/'}><img src={Logo} alt="" srcset="" /></Link></div>
                </div>
            </div>
        </div>
    )
}

export default LoginHeader
