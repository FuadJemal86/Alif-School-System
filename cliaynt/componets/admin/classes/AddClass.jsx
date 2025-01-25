import React from 'react'
import '../teachers/teacher.css'
import { useState, useEffect } from 'react'
import api from '../../../src/api'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddClass() {
    const navigate = useNavigate()
    const [teacher, setTeacher] = useState([])
    const [section, setSection] = useState({
        class_name: ''
    })

    useEffect(() => {

        const feachData = async () => {

            try {
                const result = await api.get('/auth/get-teacher-name')
                if (result.data.status) {
                    setTeacher(result.data.result)
                } else {
                    alert('data not feached')
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachData()

    }, [])

    const handelSubmit = async (e) => {
        e.preventDefault()

        const { class_name } = section
        if (!class_name) {
            return toast.error("Please fill in all required fields.");
        }

        try {
            const result = await api.post('/auth/add-class', section)

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Class saved",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/admin-dashbord/class')
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }

        } catch (err) {
            console.error(err)
        }

    }
    return (
        <div className='teacher-main-con'>
            <ToastContainer />
            <div className='add-teacher'>

                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Add Class</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setSection({ ...section, class_name: e.target.value })}
                                    placeholder='Section Name'
                                    type='text'
                                />
                            </div>

                        </div>
                        <div className='add-teacher-button'>
                            <button>Add Class</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddClass
