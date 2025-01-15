import React, { useEffect, useState } from 'react'
import '../admin/teachers/teacher.css'
import { LogOut, User, Book, GraduationCap } from 'lucide-react';
import studentValidation from '../../src/hooks/studentValidation';
import api from '../../src/api';
import { useParams } from 'react-router-dom';

function EditStudentProfile() {
    

    const {id} = useParams()
    const [studentInfo , setStudentInfo] = useState({
        password:''
    })

    const handelSubmit = async(c) => {
        c.preventDefault()

        try {
            const result = await api.put(`/student/edit-student/${id}` , studentInfo)

            if(result.data.status) {
                alert('studnt edited')
            } else {
                alert(result.data.message)
            }
        }catch(err) {
            console.log(err)
        }
    }

    studentValidation()

    const handelLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }
    return (
        <div>
            <header className="student-dashboard-header">
                <div className="student-header-container">
                    <div className="student-school-brand">
                        <div className="student-school-logo">
                            <GraduationCap size={32} />
                        </div>
                        <div><h1>Alif School</h1></div>
                    </div>

                    <button className="student-logout-button d-none d-sm-block m-3">
                        <LogOut size={20} />
                        <span onClick={handelLogout}>Logout</span>
                    </button>

                    <button className="student-logout-button d-block d-sm-none m-3 ">
                        <span onClick={handelLogout}>
                            <LogOut size={16} className='fw-bold' />
                        </span>

                    </button>
                </div>
            </header>
            <div className='edit-student-main'>
                <form className='add-teacher-con add-student' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Edit Profile</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudentInfo({ ...studentInfo, password: e.target.value })}
                                    placeholder='new password'
                                    type='text'
                                />
                            </div>

                        </div>
                        <div className='add-student-button'>
                            <button type='submit'>Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditStudentProfile
