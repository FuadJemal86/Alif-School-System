import React, { useState } from 'react'
import '../admin/navCss/nav.css'
import api from '../../src/api'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'


function EditAdmin() {

    const {id} = useParams()
    const navigate = useNavigate()

    const [adminInfo, setAdminInfo] = useState({
        name: '',
        password: '',
        image: ''
    })

    const handelSubmit = async (e) => {

        e.preventDefault()

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', adminInfo.name);
        formData.append('password', adminInfo.password);
        formData.append('image', adminInfo.image);

        try {
            const result = await api.put(`/auth/edit-admin/${id}`, formData)

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/admin-dashbord/admin-profile')
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.error(err.messgae)
        }

    }
    return (
        <div className='admin-profile-container'>

            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Edit Admin</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setAdminInfo({ ...adminInfo, name: e.target.value })}
                                    placeholder='name'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setAdminInfo({ ...adminInfo, password: e.target.value })}
                                    placeholder='password'

                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setAdminInfo({ ...adminInfo, image: e.target.files[0] })}
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
    )
}

export default EditAdmin
