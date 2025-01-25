import React, { useEffect, useState } from 'react';
import '../teacherNav/mainTeacher.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faBars, faChartBar, faUser, faSignOutAlt, faUsers, faClipboardList, faBell,faHistory } from '@fortawesome/free-solid-svg-icons';
import alifLogo from '../../home/logo/alif.png'
import { Link, Outlet } from 'react-router-dom';
import api from '../../../src/api';
import teacherValidation from '../../../src/hooks/teacherValidation';
import Swal from 'sweetalert2';

function Nav() {
    teacherValidation()

    const [teacherInfo, setTeacherInfo] = useState([])
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState();
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    useEffect(() => {

        const feachData = async () => {

            try {
                const result = await api.get('/teacher/get-teacher-profile')
                if (result.data.status) {
                    setTeacherInfo(result.data.teacher)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }

        }
        feachData()

    }, [])



    const handelLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    useEffect(() => {

        const feahData = async () => {
            try {
                const result = await api.get('/auth/get-message')
                if (result.data.status) {
                    setNotificationCount(result.data.result.length)
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feahData()

    }, [])




    return (
        <div>

            {/* Header Section */}
            <div className={`t-header-container ${!isNavOpen ? 'header-wid' : ''}`}>
                <header className='t-heade'>
                    <div className='header-main'>
                        <div className='header-main1'>
                            <button className="nav-toggle-btn" onClick={toggleNav}>
                                <FontAwesomeIcon icon={faBars} />
                            </button>

                            <div className='t-bell'>
                                <Link to={'/teacher-nav/notification'}><FontAwesomeIcon icon={faBell} style={{ fontSize: '23px', cursor: 'pointer', padding: '12px', paddingTop: '12px', color: '#295F98' }} /></Link>
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

                            <div className='teacher-profile'>
                                {
                                    teacherInfo.image !== null ? (
                                        <div><img src={`https://fuad.jmcpharma.com/image/${teacherInfo.image}`} alt="" srcset="" /></div>

                                    ) : (
                                        <div style={{padding:'7px'}}><FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '30px', color: '#295F98' }} /></div>
                                    )
                                }
                                
                            </div>

                        </div>
                    </div>
                </header>
            </div>

            {/* Navigation Section */}
            <div className={` t-nav-main ${isNavOpen ? 'open' : ''}` }>
                <div className='t-nav-text'>
                    <div>
                        <img style={{width:'45px' , height:'45px',borderRadius:'50px' , background:'white'}} src= {alifLogo} alt="" srcset="" />
                    </div>
                    <div>
                        Teacher Menu
                    </div>
                </div>

                <div><hr style={{ border: "1px solid #ECEBDE", margin: "16px 8px" }} /></div>
                <div className='t-nav-main1'>
                    <ul>
                        <li>
                            <Link to={'dashbord'} className='t-link'>
                                <FontAwesomeIcon icon={faChartBar} className='t-nav-icone' /> Overview
                            </Link>
                        </li>

                        <li>
                            <Link to={'assisment'} className='t-link'>
                                <FontAwesomeIcon icon={faClipboardList} className='t-nav-icone' /> Assisment
                            </Link>
                        </li>

                        <li>
                            <Link to={'student-list'} className='t-link'>
                                <FontAwesomeIcon icon={faClipboardList} className='t-nav-icone' /> Student Grade
                            </Link>
                        </li>
                        <li>
                            <Link to={'grade-list'} className='t-link'>
                                <FontAwesomeIcon icon={faUsers} className='t-nav-icone' /> Grade List
                            </Link>
                        </li>
                        <li>
                            <Link to={'attendance'} className='t-link'>
                                <FontAwesomeIcon icon={faClipboardList} className='t-nav-icone' /> Attendance
                            </Link>
                        </li>

                        <li>
                            <Link to={'history'} className='t-link'>
                                <FontAwesomeIcon icon={faHistory } className='t-nav-icone' /> Absent History
                            </Link>
                        </li>

                        <li>
                            <Link to={'teacher-profile'} className='t-link'>
                                <FontAwesomeIcon icon={faUser} className='t-nav-icone' /> Profile
                            </Link>
                        </li>
                        <li>
                            <Link onClick={handelLogout} className='t-link'>
                                <FontAwesomeIcon icon={faSignOutAlt} className='t-nav-icone' /> Logout
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
            <div className={`t-main-outlet ${!isNavOpen ? 't-main-outlet-mobile' : ''}`}>
                <Outlet />
            </div>
        </div>

    );
}

export default Nav;
