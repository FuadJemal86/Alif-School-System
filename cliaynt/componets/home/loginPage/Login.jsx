import React, { useState } from 'react';
import logo from '../logo/alif.png';
import '../loginPage/loginCss/login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPhone, faEnvelope,faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import api from '../../../src/api';
import toast, { Toaster } from 'react-hot-toast';


function Login() {

    const navigate = useNavigate()

    const [teacherInfo, setTeacherInfo] = useState({
        email: '',
        password: ''
    })


    const handelsubmit = async (e) => {

        e.preventDefault()

        const { email, password } = teacherInfo

        if (!email || !password) {
            return toast.error('Missing required fields')
        }

        try {
            const result = await api.post('/teacher/teacher-login', teacherInfo)

            if (result.data.loginStates && result.data.token) {
                localStorage.setItem('token', result.data.token)
                navigate('/teacher-nav/dashbord')
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err.message)
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
                <form onSubmit={handelsubmit}>
                    <div className='login-teacher-container'>
                        <div className='login-teacher-container1'>
                            <div className='alif-logoo'><img src={logo} alt="" /></div>
                            <div className='t-login-text'>Teacher Login!</div>
                            <div className='t-input'>
                                <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                                <input
                                    onChange={(e) => setTeacherInfo({ ...teacherInfo, email: e.target.value })}
                                    placeholder='Username'
                                    className="input"
                                    
                                />
                            </div>

                            <div className='t-input'>
                                <span className='t-input-icone'><FontAwesomeIcon icon={faLock} /></span>
                                <input
                                    onChange={(e) => setTeacherInfo({ ...teacherInfo, password: e.target.value })}
                                    placeholder='Password'
                                    

                                />
                            </div>
                            <div className='t-login'>
                                <button >Login <FontAwesomeIcon icon={faRightToBracket} />

                                </button>
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

                </form>



            </div>
            <Toaster
                position="top-center" // Position of the toast
                reverseOrder={false} // Keep toasts in the order they were added
            />
            <Footer />

        </div>
    )
}

export default Login
