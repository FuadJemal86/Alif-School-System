import React, { useState } from 'react'
import './loginCss/studentLogin.css'
import { Link, useNavigate } from 'react-router-dom';
import '../loginPage/loginCss/login.css'
import logo from '../logo/alif.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer';
import api from '../../../src/api';
import toast, { Toaster } from 'react-hot-toast';

function StudentLogin() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [studentInfo, setStudentInfo] = useState({
        email: '',
        password: ''
    })

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handelsubmit = async (e) => {

        e.preventDefault()

        setIsLoading(true)

        const { email, password } = studentInfo

        if (!email || !password) {
            setIsLoading(false);
            return toast.error('Missing required fields')
        }

        try {
            const result = await api.post('/student/login', studentInfo)

            if (result.data.loginStates && result.data.token) {
                await delay(1000);
                localStorage.setItem('token', result.data.token)
                navigate('/student-profile')
            } else {
                await delay(1000);
                setIsLoading(false);
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err.message)
            setIsLoading(false);
        }
    }
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
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
                <form onSubmit={handelsubmit} className="login-form">
                    <div className="login-teacher-container">
                        <div className="login-teacher-container1">
                            <div className="lo-alif-logoo">
                                <img src={logo} alt="" />
                            </div>
                            <div className="t-login-text">Student Login!</div>

                            {/* Email Input */}
                            <div className="form-group">
                                <div className="input-container">
                                    <span className="input-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input
                                        onChange={(e) =>
                                            setStudentInfo({ ...studentInfo, email: e.target.value })
                                        }
                                        placeholder="Username"
                                        className="form-input"
                                        type="email"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <div className="input-container">
                                    <span className="input-icon">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                    <input
                                        name="password"
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setStudentInfo({ ...studentInfo, password: e.target.value })
                                        }
                                        className="form-input"
                                        type="password"
                                    />
                                </div>
                            </div>

                            <div className='forget-link-main'>
                                <Link className='forget-link'>Forgot password ?</Link>
                            </div>

                            {/* Login Button */}
                            <div className="t-login">
                                {isLoading ? (
                                    <button className="login-loader-button login-button" disabled>
                                        <span className="login-loader"></span>
                                    </button>
                                ) : (
                                    <button type="submit" className="login-button">
                                        Login
                                        <FontAwesomeIcon icon={faRightToBracket} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="t-buttons-container">
                        <div className="t-buttons">
                            <Link to={'/techer-login'}>Teacher</Link>
                        </div>
                        <div className="t-buttons-teacher">
                            <Link>Student</Link>
                        </div>
                        <div className="t-buttons">
                            <Link to={'/admin-login'}>Admin</Link>
                        </div>
                    </div>
                </form>

            </div>
            <Footer />


        </div>
    )
}

export default StudentLogin
