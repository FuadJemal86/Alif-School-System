import React, { useEffect, useState } from 'react';
import '../../../admin/navCss/nav.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../src/api';

function TeacherProfile() {

    const [teacherInfo, setTeacherInfo] = useState([])

    useEffect(() => {
        feachData()

    }, [])

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
    return (
        <div>
            <div className='admin-profile-container'>
                <div className='admin-profile-con'>
                    <div className='admin-profile-con1'>

                        <div className='admin-image'>
                            <div className='admin-profile-text'>Teacher Profile</div>
                            <img src={`http://localhost:3032/image/${teacherInfo.image}`} alt="" srcset="" />
                            <div><Link to={`/teacher-nav/edit-teacher/${teacherInfo.id}`} style={{ color: 'red' }}><FontAwesomeIcon icon={faPenToSquare} />edit</Link></div>
                        </div>

                        <div className='admin-profile-info'>
                            <div> <strong>Name:  </strong>{teacherInfo.name}</div>
                            <div><strong>Email:  </strong>{teacherInfo.email}</div>
                            <div><strong>Subject:  </strong>{teacherInfo.subject_name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherProfile
