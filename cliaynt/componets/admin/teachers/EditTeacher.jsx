import React from 'react'
import '../teachers/teacher.css'
import { useEffect, useState } from 'react'
import api from '../../../src/api'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


function EditTeacher() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [subject, setSubject] = useState([])
    const [teacher, setTeacher] = useState({
        name: '',
        subject_id: '',
        email: '',
        phone: '',
        address: ''
    })

    const handelSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await api.put(`/auth/update-teacher/${id}`, teacher)
            if (result.data.status) {
                alert(result.data.message)
                navigate('/admin-dashbord/teacher')
            } else {
                console.log(result.data.error)
            }
        } catch (err) {
            console.error(err.message)
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/auth/get-subject');
                if (result.data.status) {
                    setSubject(result.data.result)
                } else {
                    console.error('Error fetching data:', result.data.error);
                }

            } catch (err) {
                console.error(err)
            }
        }
        fetchData()

    }, [])

    useEffect(() => {

        const getData = async () => {
            try {
                const result = await api.get(`/auth/get-teacher/${id}`)

            if (result.data.status) {
                setTeacher(result.data.result[0])
            } else {
                alert('teacher is not fond',result.data.error)
            }
            } catch(err) {
                console.log(err)
            }
        }

        getData()
    }, [])
    return (
        <div>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Edit Teacher</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    value={teacher.name}
                                    onChange={e => setTeacher({ ...teacher, name: e.target.value })}
                                    placeholder='name'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setTeacher({ ...teacher, subject_id: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>
                                    {
                                        subject.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>

                                        ))
                                    }
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    value={teacher.email}
                                    onChange={e => setTeacher({ ...teacher, email: e.target.value })}
                                    placeholder='email'

                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    value={teacher.phone}
                                    onChange={e => setTeacher({ ...teacher, phone: e.target.value })}
                                    placeholder='phone'
                                    type='text'
                                />
                            </div>


                            <div className='add-teacher-inputs'>
                                <input
                                    value={teacher.address}
                                    onChange={e => setTeacher({ ...teacher, address: e.target.value })}
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

export default EditTeacher
