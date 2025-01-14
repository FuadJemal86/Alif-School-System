import React from 'react'
import '../admin/teachers/teacher.css'
import { LogOut, User, Book, GraduationCap } from 'lucide-react';
import studentValidation from '../../src/hooks/studentValidation';

function EditStudentProfile() {

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
                <form className='add-teacher-con add-student'>
                    <div >
                        <div className='add-teacher-text'>Edit Profile</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    // onChange={e => setTeacher({ ...teacher, name: e.target.value })}
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
