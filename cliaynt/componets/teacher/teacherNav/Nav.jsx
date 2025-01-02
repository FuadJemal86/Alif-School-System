import React, { useEffect, useState } from 'react';
import '../teacherNav/mainTeacher.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChartBar, faUser, faSignOutAlt, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet } from 'react-router-dom';
import api from '../../../src/api';

function Nav() {
    const [teacherInfo , setTeacherInfo] = useState([])
    const [isNavOpen, setIsNavOpen] = useState(true);
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    useEffect(() => {
        feachData()

    } ,[])

    const feachData = async() => {

        try {
            const result = await api.get('/get-teacher-profile')
            if(result.data.status) {
                setTeacherInfo(result.data.result)
            } else {
                console.log(result.data.message)
            }
        } catch(err) {
            console.log(err)
        }

    }

    return (
        <div>
            
            {/* Header Section */}
            <div className={`t-header-container ${!isNavOpen ? 'header-wid' : ''}`}>
                <header className='t-heade'>
                    <div className='header-main'>
                        <div>
                            <button className="nav-toggle-btn" onClick={toggleNav}>
                                <FontAwesomeIcon icon={faBars} />
                            </button>

                            <div className='t-notification-gire'>

                            </div>
                            <div className='t-elips-dot'>
                                <img src={`http://localhost:3032/image/${teacherInfo.image}`} alt="" srcset="" />
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            {/* Navigation Section */}
            <div className={`t-nav-main ${isNavOpen ? 'open' : ''}`}>
                <div className='t-nav-text'>Teacher Menu</div>
                <div className='t-nav-main1'>
                    <ul>
                        <li>
                            <Link className='t-link'>
                                <FontAwesomeIcon icon={faChartBar} className='t-nav-icone' /> Overview
                            </Link>
                        </li>
                        <li>
                            <Link to={'student-list'} className='t-link'>
                                <FontAwesomeIcon icon={faClipboardList} className='t-nav-icone' /> Student List
                            </Link>
                        </li>
                        <li>
                            <Link to={'grade-list'} className='t-link'>
                                <FontAwesomeIcon icon={faUsers} className='t-nav-icone' /> Grade
                            </Link>
                        </li>
                        <li>
                            <Link to={'attendance'} className='t-link'>
                                <FontAwesomeIcon icon={faClipboardList} className='t-nav-icone' /> Attendance
                            </Link>
                        </li>
                        <li>
                            <Link className='t-link'>
                                <FontAwesomeIcon icon={faUser} className='t-nav-icone' /> Profile
                            </Link>
                        </li>
                        <li>
                            <Link className='t-link'>
                                <FontAwesomeIcon icon={faSignOutAlt} className='t-nav-icone' /> Logout
                            </Link>
                        </li>
                    </ul>
                </div>
                
            </div>
            <div className={`t-main-outlet ${!isNavOpen ? 't-main-outlet-mobile' : ''}`}>
                <Outlet/>
            </div>
        </div>
        
    );
}

export default Nav;
