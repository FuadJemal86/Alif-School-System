import React, { useState } from 'react'
import '../teachers/teacher.css'

import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2'
import api from '../../../src/api';


function AddAccount() {

    const [adminInfo, setAdminInfo] = useState({
        name: '',
        email: '',
        password: '',
        image: ''
    })

    const handelSubmit = async (e) => {

        e.preventDefault()

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', adminInfo.name);
        formData.append('email', adminInfo.email);
        formData.append('password', adminInfo.password);
        formData.append('image', adminInfo.image);

        try {
            const result = await api.post('/auth/add-admin', formData)

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });

            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.error(err.messgae)
        }

    }


    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Add Admin</div>
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
                                    onChange={e => setAdminInfo({ ...adminInfo, email: e.target.value })}
                                    placeholder='email'

                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setAdminInfo({ ...adminInfo, password: e.target.value })}
                                    placeholder='password'
                                    type='text'
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
                                Add Admin</button>
                        </div>
                    </div>
                </form>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}

export default AddAccount
