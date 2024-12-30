import React from 'react'
import '../teachers/teacher.css'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import api from '../../../src/api'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function EditStudent() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [student, setStudents] = useState({
        name: '',
        email: '',
        class_name: '',
        gender: '',
        phone: '',
        dob: '',
        address: ''
    })
    const [studentClass, setClass] = useState([])

    useEffect(() => {

        const fechDate = async () => {
            try {
                const result = await api.get(`/auth/get-student/${id}`)
                if (result.data.status) {
                    setStudents(result.data.result[0])
                } else {
                    console.log(result.data.error)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fechDate()

    }, [])

    useEffect(() => {
        const fechClass = async () => {
            try {
                const result = await api.get('/auth/get-class')
                if (result.data.status) {
                    setClass(result.data.result)
                    console.log(result.data.result)
                } else {
                    console.error(result.data.error)
                }
            } catch (err) {
                console.error(err.message)
            }
        }
        fechClass()
    }, [])

    const handelSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await api.put(`/auth/update-student/${id}`, student)
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "student update successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/admin-dashbord/student')
            } else {
                console.error(err.message)
            }
        } catch (err) {
            console.error(err.message)
        }
    }
    return (
        <div>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Edit Student</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    value={student.name}
                                    onChange={e => setStudents({ ...student, name: e.target.value })}
                                    placeholder='name'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    value={student.email}
                                    onChange={e => setStudents({ ...student, email: e.target.value })}
                                    placeholder='email'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setStudents({ ...student, class_name: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value='' disabled>
                                        Select Class
                                    </option>
                                    {
                                        studentClass.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>

                                        ))
                                    }
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setStudents({ ...student, gender: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a gender
                                    </option>
                                    <option >
                                        Male
                                    </option>
                                    <option >
                                        Female
                                    </option>
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    value={student.parent_contact}
                                    onChange={e => setStudents({ ...student, phone: e.target.value })}
                                    placeholder='phone'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudents({ ...student, dob: e.target.value })}
                                    placeholder='dob'
                                    type='date'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    value={student.address}
                                    onChange={e => setStudents({ ...student, address: e.target.value })}
                                    placeholder='address'
                                    type='text'
                                />
                            </div>
                        </div>
                        <div className='add-teacher-button'>
                            <button type='submit'>Edit Teacher</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditStudent
