import React, { useState } from 'react';
import logo from '../logo/alif.png';
import '../loginPage/loginCss/login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPhone, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import api from '../../../src/api';
import toast, { Toaster } from 'react-hot-toast';





function Login() {



    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [teacherInfo, setTeacherInfo] = useState({
        email: '',
        password: ''
    })

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handelsubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true);

        const { email, password } = teacherInfo

        if (!email || !password) {
            setIsLoading(false);
            return toast.error('Missing required fields')
        }

        try {
            const result = await api.post('/teacher/teacher-login', teacherInfo)

            if (result.data.loginStates && result.data.token) {

                localStorage.setItem('token', result.data.token)
                await delay(1000);
                navigate('/teacher-nav/dashbord')
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
                <form onSubmit={handelsubmit} className="login-form">
                    <div className="login-teacher-container">
                        <div className="login-teacher-container1">
                            <div className="lo-alif-logoo">
                                <img src={logo} alt="" />
                            </div>
                            <div className="t-login-text">Teacher Login!</div>

                            {/* Email Input */}
                            <div className="form-group">
                                <div className="input-container">
                                    <span className="input-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input
                                        onChange={(e) =>
                                            setTeacherInfo({ ...teacherInfo, email: e.target.value })
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
                                            setTeacherInfo({ ...teacherInfo, password: e.target.value })
                                        }
                                        className="form-input"
                                        type="password"
                                    />
                                </div>
                            </div>
                            <div className='forget-link-main'>
                                <Link to={'/forgot-email'} className='forget-link'>Forgot password ?</Link>
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
                        <div className="t-buttons-teacher">
                            <Link>Teacher</Link>
                        </div>
                        <div className="t-buttons">
                            <Link to={'/student-login'}>Student</Link>
                        </div>
                        <div className="t-buttons">
                            <Link to={'/admin-login'}>Admin</Link>
                        </div>
                    </div>
                </form>




            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Footer />

        </div>
    )
}

export default Login
