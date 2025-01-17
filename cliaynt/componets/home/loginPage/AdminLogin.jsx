import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../loginPage/loginCss/login.css'
import logo from '../logo/alif.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer';
import api from '../../../src/api';
import { Toaster, toast } from 'react-hot-toast';


function AdminLogin() {

    const navigate = useNavigate()
    const [adminInfo, setadminInfo] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handelsubmit = async (e) => {

        e.preventDefault()

        setIsLoading(true)

        const { email, password } = adminInfo

        if (!email || !password) {
            setIsLoading(false);
            return toast.error('Missing required fields')
        }

        try {
            const result = await api.post('/auth/admin-login', adminInfo)

            if (result.data.loginStates && result.data.token) {
                localStorage.setItem('token', result.data.token)
                await delay(1000);
                navigate('/admin-dashbord')
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
                            <div className="t-login-text">Admin Login!</div>

                            {/* Email Input */}
                            <div className="form-group">
                                <div className="input-container">
                                    <span className="input-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input
                                        onChange={(e) =>
                                            setadminInfo({ ...adminInfo, email: e.target.value })
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
                                            setadminInfo({ ...adminInfo, password: e.target.value })
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
                        <div className="t-buttons">
                            <Link to={'/techer-login'}>Teacher</Link>
                        </div>
                        <div className="t-buttons">
                            <Link to={'/student-login'}>Student</Link>
                        </div>
                        <div className="t-buttons-teacher">
                            <Link>Admin</Link>
                        </div>
                    </div>
                </form>


            </div>




            <Footer />
        </div>
    )
}

export default AdminLogin
