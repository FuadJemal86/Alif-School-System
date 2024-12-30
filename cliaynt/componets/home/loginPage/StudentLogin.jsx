import React from 'react'
import './loginCss/studentLogin.css'
import { Link } from 'react-router-dom';
import '../loginPage/loginCss/login.css'
import logo from '../logo/alif.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer';

function StudentLogin() {
    return (
        <div>
            <div>
                <div className='login-header-container'>

                    <div className='login-header-container2'>
                        <div className='header-nav-conatiner'>
                            <div className='alif-login-image'>
                                <Link to={'/'} className='login-alif-logo'><img src={logo} alt="" /></Link>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div >
                <div className='login-teacher-container'>
                    <div className='login-teacher-container1'>
                        <div className='alif-logoo'><img src={logo} alt="" /></div>
                        <div className='t-login-text'>Student Login!</div>
                        <div className='t-input'>
                            <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input
                                placeholder='Username'
                            />
                        </div>

                        <div className='t-input'>
                            <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input
                                placeholder='Password'
                            />
                        </div>
                        <div className='t-login'>
                            <button >Login <FontAwesomeIcon icon={faRightToBracket} /></button>
                        </div>
                    </div>
                </div>

                <div className='t-buttons-container'>
                    <div className='t-buttons '>
                        <Link to={'/techer-login'}>Teacher</Link>
                    </div>
                    <div className='t-buttons-teacher'>
                        <Link>Student</Link>
                    </div>
                    <div className='t-buttons'>
                        <Link to={'/admin-login'}>Admin</Link>
                    </div>
                </div>


            </div>
            <Footer />


        </div>
    )
}

export default StudentLogin
