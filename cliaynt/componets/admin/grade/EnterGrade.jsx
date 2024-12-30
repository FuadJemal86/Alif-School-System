import React from 'react'
import '../teachers/teacher.css'
import { useState, useEffect } from 'react'
import api from '../../../src/api'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';


function EnterGrade() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [student, setStudent] = useState([])
    const [subject, setsubject] = useState([])
    const [grade, setgrade] = useState({
        student_id: '',
        subject_id: '',
        grade: ''
    })

    useEffect(() => {

        const fechData = async () => {
            try {
                const result = await api.get(`/auth/get-student/${id}`)
                if (result.data.status) {
                    setStudent(result.data.result[0]);
                    setgrade((prevGrade) => ({ ...prevGrade, student_id: result.data.result[0]?.id }));

                } else {
                    console.error(result.data.error)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fechData()

    }, [])

    useEffect(() => {

        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-subject')
                if (result.data.status) {
                    setsubject(result.data.result)
                } else {
                    console.error(result.data.error)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fechData()

    }, [])

    const handelSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await api.post('/auth/add-grade', grade)
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1550
                });

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }

        } catch (err) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: err.response.data.message || 'Something went wrong!',
                showConfirmButton: true,
            });
        }
    }



    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Grade</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    value={student.id || ''}
                                    placeholder='Student ID'
                                    type='text'
                                    readOnly
                                />
                            </div>


                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setgrade({ ...grade, subject_id: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>
                                    {
                                        subject.map((c) => (
                                            <option key={c.id} value={c.id}  >
                                                {c.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setgrade({ ...grade, grade: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Grade
                                    </option>
                                    <option>A+</option>
                                    <option>A</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B</option>
                                    <option>B-</option>
                                    <option>C+</option>
                                    <option>C</option>
                                    <option>C-</option>
                                    <option>D</option>
                                    <option>F</option>
                                </select>
                            </div>
                        </div>
                        <div className='add-teacher-button'>
                            <button>Insert</button>
                        </div>
                    </div>
                </form>
            </div>



        </div>
    )
}

export default EnterGrade
