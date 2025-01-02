import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../../src/api'
import toast, { Toaster } from 'react-hot-toast';

function EditAttendance() {

    const { id } = useParams()

    const [beforeStatus, setBeforeStatus] = useState({})

    useEffect(() => {
        feachData()
    }, [])

    const feachData = async () => {
        try {
            const result = await api.get(`/teacher/before-status/${id}`)

            if (result.data.status) {
                console.log('status exist!')
                setBeforeStatus(result.data.result[0].status)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const [attendanceStatus, setAttendanceStatus] = useState({
        status: ''
    })

    const handelSubmit = async (e) => {

        e.preventDefault()
        try {
            const result = await api.put(`/teacher/edit-attendance/${id}`, attendanceStatus)

            if (result.data.status) {
                toast.success('Updated!')
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>

            <div className='admin-profile-container'>

                <div className='add-teacher'>
                    <form className='add-teacher-con' onSubmit={handelSubmit}>
                        <div >
                            <div className='add-teacher-text'>Edit Attendance</div>
                            <div className='add-teacher-con1'>

                                <div className='add-teacher-inputs'>
                                    <input
                                        placeholder={beforeStatus}
                                        type='text'
                                        readOnly
                                    />
                                </div>

                                <div className='add-teacher-inputs'>
                                    <select
                                        onChange={(e) => setAttendanceStatus({ ...attendanceStatus, status: e.target.value })}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Status
                                        </option>

                                        <option >
                                            Absent
                                        </option>

                                        <option >
                                            Present
                                        </option>

                                    </select>
                                </div>

                            </div>
                            <div className='add-teacher-button'>
                                <button>Update</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}

export default EditAttendance
