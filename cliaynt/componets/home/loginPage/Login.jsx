import React from 'react';
import logo from '../logo/alif.png';
import '../loginPage/loginCss/login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
function Login() {
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
            <div>
                <div className='login-teacher-container'>
                    <div className='login-teacher-container1'>
                        <div className='alif-logoo'><img src={logo} alt="" /></div>
                        <div className='t-login-text'>Teacher Login!</div>
                        <div className='t-input'>
                            <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input
                                placeholder='Username'
                                required
                            />
                        </div>

                        <div className='t-input'>
                            <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input
                                placeholder='Password'
                                required

                            />
                        </div>
                        <div className='t-login'>
                            <button >Login <FontAwesomeIcon icon={faRightToBracket} /></button>
                        </div>
                    </div>
                </div>

                <div className='t-buttons-container'>
                    <div className='t-buttons-teacher'>
                        <Link>Teacher</Link>
                    </div>
                    <div className='t-buttons'>
                        <Link to={'/student-login'}>Student</Link>
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

export default Login
