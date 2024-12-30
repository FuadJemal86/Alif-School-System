import React, { useState } from 'react'
import '../teachers/teacher.css'
import api from '../../../src/api'
import Swal from 'sweetalert2';

function AddDipartement() {

    const [dipartmen, setDipartment] = useState({
        name: ''
    })

    const handelSubmit = async (c) => {
        c.preventDefault()

        try {
            const result = await api.post('/auth/add-dipa', dipartmen)
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Dipartment saved",
                    showConfirmButton: false,
                    timer: 1500
                });

            } else {
                console.log(result.data.message)
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <div>
                <div className='teacher-main-con'>
                    {/* <ToastContainer /> */}
                    <div className='add-teacher'>

                        <form className='add-teacher-con' onSubmit={handelSubmit}>
                            <div >
                                <div className='add-teacher-text'>Add Dipartment</div>
                                <div className='add-teacher-con1'>
                                    <div className='add-teacher-inputs'>
                                        <input
                                            onChange={e => setDipartment({ ...dipartmen, name: e.target.value })}
                                            placeholder='Name'
                                            type='text'
                                        />
                                    </div>

                                </div>
                                <div className='add-teacher-button'>
                                    <button>Add</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default AddDipartement
