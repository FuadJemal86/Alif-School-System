import React, { useEffect, useState } from 'react'
import './navCss/nav.css'
import LogoAlif from '../home/logo/alif.png'
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    faGear
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
                                            <Link to={'/admin-dashbord/add-account'} className='dropdown-item'><FontAwesomeIcon icon={faPlus} />Add Account</Link>
                                            <div onClick={handelLogout} className='logout-dropdown-item'><FontAwesomeIcon icon={faRightFromBracket} />Logout</div>
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
                    <div className='admin-page-text'>Admin Page</div>
                    <nav className='text-container2'>
                        <ul className='text-container3'>
                            <li>
                                <Link to={''}>
                                    <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" /> Overview
                                </Link>
                            </li>
                            <li>
                                <Link to={'subject'}>
                                    <FontAwesomeIcon icon={faBook} className="nav-icon" /> Subject
                                </Link>
                            </li>
                            <li>
                                <Link to={'teacher'}>
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="nav-icon" /> Teacher
                                </Link>
                            </li>
                            <li>
                                <Link to={'class'}>
                                    <FontAwesomeIcon icon={faSchool} className="nav-icon" /> Classes
                                </Link>
                            </li>

                            <li>
                                <Link to={'dipartmen'}>
                                    <FontAwesomeIcon icon={faInbox} className="nav-icon" /> Dipartment
                                </Link>
                            </li>

                            <li>
                                <Link to={'student'}>
                                    <FontAwesomeIcon icon={faUserGraduate} className="nav-icon" /> Students
                                </Link>
                            </li>
                            <li>
                                <Link to={'grade'}>
                                    <FontAwesomeIcon icon={faGraduationCap} className="nav-icon" /> Grades
                                </Link>
                            </li>
                            <li>
                                <Link to={'parent'}>
                                    <FontAwesomeIcon icon={faUsers} className="nav-icon" /> Parents
                                </Link>
                            </li>

                            <li>
                                <Link to={'sitting'}>
                                    <FontAwesomeIcon icon={faGear} className="nav-icon" /> Sitting
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
