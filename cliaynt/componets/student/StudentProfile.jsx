import React, { useEffect, useState } from 'react';
import { LogOut, User, Book, GraduationCap } from 'lucide-react';
import './studentProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../src/api';
import studentValidation from '../../src/hooks/studentValidation';

const StudentProfile = () => {

    studentValidation()

    const [studentDetail, setStudentDeatil] = useState([])
    const [studentProfile, setProfile] = useState({})


    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/student/student-result')

                if (result.data.status) {
                    setStudentDeatil(result.data.student)
                    setProfile(result.data.student[0])
                } else {
                    console.log('student not found')
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachData()

    }, [])
    // Sample student data
    const student = {
        name: studentProfile.student_name,
        grade: studentProfile.class_name,
        studentId: studentProfile.student_id,
        email: studentProfile.email
    };

    const getGradeClassName = (grade) => {
        if (grade == 'A') return 'grade-badge grade-a';
        if (grade == 'B') return 'grade-badge grade-b';
        return 'grade-badge grade-c';
    };


    const handelLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    return (
        <div className="">
            <div className='student-dashboard'>
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
                            <LogOut size={16} className='fw-bold' />
                        </button>
                    </div>
                </header>

                <main className="student-dashboard-main">
                    <div className="student-dashboard-grid">
                        {/* Profile Card */}
                        <div className="student-card student-profile-card">
                            <div className="student-card-header">
                                <User size={20} />
                                <h2>Student Profile</h2>
                            </div>
                            <div className="student-card-content">
                                <div className="student-profile-container">
                                    <div className="student-profile-avatar">
                                        {
                                            studentProfile.image == null ? (
                                                <User size={64} />
                                            ) : (
                                                <img src={`http://localhost:3032/image/${studentProfile.image}`} alt="" srcset="" />
                                            )
                                        }

                                    </div>
                                    <div className="student-profile-details">
                                        <p className="student-name">{student.name}</p>
                                        <p className="student-info">{student.grade}</p>
                                        <p className="student-info">ID: {student.studentId}</p>
                                        <p className="student-info">{student.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Card */}
                        <div className="student-card results-card">
                            <div className="student-card-header">
                                <Book size={20} />
                                <h2>Academic Results</h2>
                            </div>
                            <div className="student-card-content">
                                <div className="student-table-container">
                                    <table className="student-results-table">
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Assi 1</th>
                                                <th>Assi 2</th>
                                                <th>Mid</th>
                                                <th>Final</th>
                                                <th>Score</th>
                                                <th>Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentDetail.map((c) => (
                                                <tr key={c.grade_id}>
                                                    <td>{c.name || null}</td>
                                                    <td>{c.assi1 || null}</td>
                                                    <td>{c.assi2 || null}</td>
                                                    <td>{c.midterm || null}</td>
                                                    <td >{c.final || null}</td>
                                                    <td>
                                                        <span className={getGradeClassName('B')}>
                                                        {c.average || '-'}
                                                        </span></td>
                                                    <td>
                                                        <span className={getGradeClassName(c.grade)}>
                                                            {c.student_grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfile;