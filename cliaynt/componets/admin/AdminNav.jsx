import React, { useEffect, useState } from 'react'
import './navCss/nav.css'
import LogoAlif from '../home/logo/alif.png'
import 'bootstrap/dist/css/bootstrap.min.css';
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
    faMessage,
    faUserCircle,
    faBars
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
    const [isNavOpen, setIsNavOpen] = useState(true);

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/auth/count-message')
                if (result.data.status) {
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

    const toggleNav = () => {
        if(window.innerWidth <= 950) {
            setIsNavOpen(!isNavOpen);
        }
    };


    return (
        <div className=''>
            <div className={`main-nav ${!isNavOpen ? 'header-wid' : ''}`}>
                <div className='main-admin-header'>
                    <header className='header-admin'>
                        <div className='header-conatiner1'>
                            <button className="nav-toggle-btn" onClick={toggleNav}>
                                <FontAwesomeIcon icon={faBars} />
                            </button>

                            <div className='admin-profile'>
                                <div className='t-bell'>
                                    <Link to={'/admin-dashbord/notification'}><FontAwesomeIcon icon={faBell} style={{ fontSize: '23px', cursor: 'pointer', padding: '12px', paddingTop: '12px', color: '#295F98' }} /></Link>
                                    {notificationCount > 0 && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '-1',
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
                                {
                                    adminInfo.image !== null ? (
                                        <Link to={'/admin-dashbord/admin-profile'}><img src={`http://localhost:3032/image/${adminInfo.image}`} alt="" srcset="" /></Link>

                                    ) : (
                                        <Link to={'/admin-dashbord/admin-profile'} style={{ padding: '8px', paddingTop: '13px' }}><FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '30px', color: '#295F98' }} /></Link>
                                    )
                                }
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

            <div onClick={togelCloth} className={`text-nav-container   ${isNavOpen ? 'open' : ''}`}>
                <div className='text-container1'>
                    <div className='admin-page-text'>
                        <div style={{ border: '1px solid #8D77AB', borderRadius: '50px' }}><img style={{ height: '40px', width: '40px', background: 'white', borderRadius: '50px', margin: '3px' }} src={alifLogo} alt="" srcset="" /></div>
                        <div>Admin Menu</div>
                    </div>

                    <div><hr style={{ border: "1px solid #ECEBDE", margin: "20px 8px" }} /></div>

                    <nav className='text-container2' onClick={toggleNav}>
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
            <div className={`t-main-outlet ${!isNavOpen ? 't-main-outlet-mobile' : ''}`}>
                <Outlet />
            </div>



        </div>
    )
}

export default AdminNav
