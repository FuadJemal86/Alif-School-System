import React from 'react'
import '../teachers/teacher.css'
import { useEffect, useState } from 'react'
import api from '../../../src/api'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

function EnterParent() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [student, setStudent] = useState([])
    const [parent, setParent] = useState({
        name: '',
        contact: '',
        student_id: ''
    })

    useEffect(() => {

        const fechDate = async () => {
            try {
                const result = await api.get(`/auth/get-students/${id}`)

                if (result.data.status) {
                    setStudent(result.data.result[0])
                    setParent((prevGrade) => ({ ...prevGrade, student_id: result.data.result[0]?.id }));
                } else {
                    console.error(err.message)
                }
            } catch (err) {
                console.error(err.message)
            }
        }

        fechDate()

    }, [])

    const handelSubmit = async (e) => {

        e.preventDefault();

        if (!parent.name || !parent.contact) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Please fill all required fields",
                showConfirmButton: true,
            });
            return;
        }
        try {
            const result = await api.post('/auth/add-parent', parent)

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Parent added successfully!",
                    showConfirmButton: false,
                    timer: 1550
                });
                navigate('/admin-dashbord/parent')

            } else {
                console.log(result.data.error)
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: result.data.error || "Failed to add parent!",
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.log(err.message)
            Swal.fire({
                position: "center",
                icon: "error",
                title: "An unexpected error occurred!",
                showConfirmButton: true,
            });
        }

    }


    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Parent</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={(e) => setParent({ ...parent, name: e.target.value })}

                                    placeholder='parent name'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={(e) => setParent({ ...parent, contact: e.target.value })}

                                    placeholder='contact'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                
                                    placeholder={student.name}
                                    type='text'
                                    readOnly
                                />
                            </div>

                            
                            <div className='add-teacher-inputs'>
                                <input
                                    value={student.id || ''}
                                    placeholder='student_id'
                                    type='text'

                                    readOnly
                                />
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

export default EnterParent
