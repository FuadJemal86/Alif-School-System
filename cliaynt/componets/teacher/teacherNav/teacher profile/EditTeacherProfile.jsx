import React, { useEffect, useState } from 'react';
import '../../../admin/navCss/nav.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../src/api';
import Swal from 'sweetalert2';

function EditTeacherProfile() {

    const {id} = useParams()
    const navigate = useNavigate()

    const [teacherInfo, setTeacherInfo] = useState({
        password: '',
        image: ''
    })

    const [TeacherInfo, SetTeacherInfo] = useState([])

    useEffect(() => {
        feachData()

    }, [])

    const feachData = async () => {

        try {
            const result = await api.get('/teacher/get-teacher-profile')
            if (result.data.status) {
                SetTeacherInfo(result.data.teacher)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }

    }

    const handelSubmit = async (e) => {

        e.preventDefault()

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('password', teacherInfo.password);
        formData.append('image', teacherInfo.image);

        try {
            const result = await api.put(`/teacher/edit-teacher/${id}`, formData)

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/teacher-nav/teacher-profile')
                feachData()
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.error(err.messgae)
        }

    }


    return (
        <div>

            <div className='admin-profile-container'>

                <div className='add-teacher'>
                    <form className='add-teacher-con' onSubmit={handelSubmit}>
                        <div >
                            <div className='add-teacher-text'>Welcome {TeacherInfo.name}</div>
                            <div className='add-teacher-con1'>
                                
                                <div className='add-teacher-inputs'>
                                    <input
                                        onChange={e => setTeacherInfo({ ...teacherInfo, password: e.target.value })}
                                        placeholder='New password'

                                    />
                                </div>

                                <div className='add-teacher-inputs'>
                                    <input
                                        onChange={e => setTeacherInfo({ ...teacherInfo, image: e.target.files[0] })}
                                        placeholder='profile'
                                        type='file'
                                    />
                                </div>

                            </div>
                            <div className='add-teacher-button'>
                                <button>
                                    Update</button>
                            </div>
                        </div>
                    </form>
                </div>
                {/* <Toaster
    position="top-center"
    reverseOrder={false}
/> */}

            </div>

        </div>
    )
}

export default EditTeacherProfile
