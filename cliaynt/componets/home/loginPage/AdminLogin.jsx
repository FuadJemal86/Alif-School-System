import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../loginPage/loginCss/login.css'
import logo from '../logo/alif.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer';
import api from '../../../src/api';
import { Toaster, toast } from 'react-hot-toast';


function AdminLogin() {

    const navigate = useNavigate()

    const [adminInfo, setadminInfo] = useState({
        email: '',
        password: ''
    })


    const handelsubmit = async (e) => {

        e.preventDefault()

        try {
            const result = await api.post('/auth/admin-login', adminInfo)

            if (result.data.loginStates && result.data.token) {
                localStorage.setItem('token', result.data.token)
                navigate('/admin-dashbord')
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
            <div >
                <form onSubmit={handelsubmit}>
                    <div className='login-teacher-container'>
                        <div className='login-teacher-container1'>
                            <div className='alif-logoo'><img src={logo} alt="" /></div>
                            <div className='t-login-text'>Welcome Admin!</div>
                            <div className='t-input'>
                                <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                                <input
                                    onChange={(e) => setadminInfo({ ...adminInfo, email: e.target.value })}
                                    placeholder='Username'
                                />
                            </div>

                            <div className='t-input'>
                                <span className='t-input-icone'><FontAwesomeIcon icon={faEnvelope} /></span>
                                <input
                                    onChange={(e) => setadminInfo({ ...adminInfo, password: e.target.value })}
                                    placeholder='Password'
                                />
                            </div>
                            <div className='t-login'>
                                <button >Login <FontAwesomeIcon icon={faRightToBracket} />
                                    <Toaster
                                        position="top-center" // Position of the toast
                                        reverseOrder={false} // Keep toasts in the order they were added
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className='t-buttons-container'>
                    <div className='t-buttons '>
                        <Link to={'/techer-login'}>Teacher</Link>
                    </div>
                    <div className=' t-buttons'>
                        <Link to={'/student-login'}>Student</Link>
                    </div>
                    <div className='t-buttons-teacher'>
                        <Link>Admin</Link>
                    </div>
                </div>


            </div>
            <Footer />
        </div>
    )
}

export default AdminLogin
