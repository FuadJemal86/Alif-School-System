import React, { useEffect, useState } from 'react'
import './navCss/nav.css'
import LogoAlif from '../home/logo/alif.png'
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import alifLogo from '../home/logo/alif.png'
import {
    faTachometerAlt,
    faBook,
    faChalkboardTeacher,
    faSchool,
    faUserGraduate,
    faGraduationCap,
    faUsers,
    faEllipsisVertical,
    faPlus,
    faRightFromBracket,
    faBell,
    faInbox,
    faGear,
    faMessage
} from '@fortawesome/free-solid-svg-icons';
import useValidation from '../../src/hooks/validation';
import api from '../../src/api';





function AdminNav() {
    useValidation()

    const [isOpen, setOpen] = useState(false)

    const togel = () => {
        setOpen(!isOpen)
    }

    const togelCloth = () => {
        setOpen(false)
    }

    const handelLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    const [adminInfo, setAdminInfo] = useState([])
    const [notificationCount, setNotificationCount] = useState();

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/auth/count-message')
                if (result.data.status) {
                    console.log(result.data.result[0].messags)
                    setNotificationCount(result.data.result[0].messags)
                } else {
                    console.log(result.data.messaga)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachData()

    }, [])

    useEffect(() => {
        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-admin')
                if (result.data.status) {
                    console.log(result.data.admin.image)
                    setAdminInfo(result.data.admin)
                } else {
                    console.log(result.data.messaga)
                }
            } catch (err) {
                console.error(err.messaga)
            }
        }
        fechData()
    }, [])


    return (
        <div className=''>
            <div className='main-nav'>
                <div className='main-admin-header'>
                    <header className='header-admin'>
                        <div className='header-conatiner1'>
                            {/* <div className='nav-alif-logo'>
                                <img src={LogoAlif} alt="" srcset="" />
                            </div> */}

                            <div className='admin-profile'>
                                <div className='notification-icone' style={{ position: 'relative' }}>
                                    <Link to={'/admin-dashbord/notification'}><FontAwesomeIcon icon={faBell} style={{ fontSize: '23px', cursor: 'pointer', padding: '12px', paddingTop: '15px', color: '#295F98' }} /></Link>
                                    {notificationCount > 0 && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '6px',
                                                right: '-1px',
                                                backgroundColor: '#789DBC',
                                                color: 'white',
                                                borderRadius: '50%',
                                                padding: '2px 6px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {notificationCount}
                                        </span>
                                    )}
                                </div>
                                <Link to={'/admin-dashbord/admin-profile'}><img src={`http://localhost:3032/image/${adminInfo.image}`} alt="" srcset="" /></Link>
                                <div onClick={togel} className='admin-ellips-vertical'>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                            </div>

                            <div className={`admin-togel ${isOpen ? 'open' : ''}`}>
                                {
                                    isOpen && (
                                        <div onClick={togelCloth} className='admin-dropdown'>
                                            <div style={{ padding: '2px', display: 'flex' }}>
                                                <div><FontAwesomeIcon style={{ padding: '2px' }} icon={faPlus} /></div>
                                                <Link to={'/admin-dashbord/add-account'} className='dropdown-item'>Add Account</Link>
                                            </div>

                                            <div style={{ padding: '2px', display: 'flex' }} onClick={handelLogout}
                                                className='logout-dropdown-item'>
                                                <div><FontAwesomeIcon style={{ padding: '2px' }} icon={faRightFromBracket} /></div>
                                                Logout

                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    </header>
                </div>
            </div>

            <div onClick={togelCloth} className='text-nav-container'>
                <div className='text-container1'>
                    <div className='admin-page-text'>
                        <div style={{border:'1px solid #8D77AB' , borderRadius:'50px'}}><img style={{ height: '40px', width: '40px', background: 'white', borderRadius: '50px',margin:'3px' }} src={alifLogo} alt="" srcset="" /></div>
                        <div>Admin Menu</div>
                    </div>

                    <div><hr style={{ border: "1px solid #ECEBDE", margin: "20px 8px" }} /></div>

                    <nav className='text-container2'>
                        <ul className='text-container3'>
                            <li>
                                <Link to={''} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" /> Overview
                                </Link>
                            </li>
                            <li>
                                <Link to={'subject'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faBook} className="nav-icon" /> Subject
                                </Link>
                            </li>

                            <li>
                                <Link to={'class'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faSchool} className="nav-icon" /> Classes
                                </Link>
                            </li>

                            <li>
                                <Link to={'teacher'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="nav-icon" /> Teacher
                                </Link>
                            </li>

                            <li>
                                <Link to={'dipartmen'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faInbox} className="nav-icon" /> Dipartment
                                </Link>
                            </li>

                            <li>
                                <Link to={'student'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faUserGraduate} className="nav-icon" /> Students
                                </Link>
                            </li>
                            <li>
                                <Link to={'grade'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faGraduationCap} className="nav-icon" /> Grades
                                </Link>
                            </li>
                            <li>
                                <Link to={'parent'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faUsers} className="nav-icon" /> Parents
                                </Link>
                            </li>

                            <li>
                                <Link to={'/admin-dashbord/send-message'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faMessage} className="nav-icon" /> Message
                                </Link>
                            </li>

                            <li>
                                <Link to={'sitting'} className='a-nav-link'>
                                    <FontAwesomeIcon icon={faGear} className="nav-icon" /> Setting
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
            <div onClick={togelCloth} className="main-content">
                <Outlet />
            </div>



        </div>
    )
}

export default AdminNav
