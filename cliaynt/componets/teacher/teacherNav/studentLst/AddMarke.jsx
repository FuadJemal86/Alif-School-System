import React, { useEffect, useState } from 'react'
import '../../../admin/teachers/teacher.css'
import api from '../../../../src/api'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';

function AddMarke() {

    const { id } = useParams()
    const [exams , setExams] = useState({})
    const [assistenses, setAssistance] = useState([])
    const [mark, setMark] = useState({
        assi1: '',
        assi2: '',
        midterm: '',
        final: ''
    })


    useEffect(() => {

        const feacheData = async () => {
            try {
                const result = await api.get('/teacher/get-assistence')
                if (result.data.status) {
                    setAssistance(result.data.students[0])
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feacheData()


    }, [])

    const handelSubmit = async (e) => {

        e.preventDefault()

        try {
            const result = await api.post(`/teacher/add-assistence/${id}`, {
                teacher_id: assistenses.teacher_id,
                class_id: assistenses.class_id,
                subject_id: assistenses.subject_id,
                ...mark
            })

            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message,
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.error(err)
        }

    }

    useEffect(() => {

        const feacheData = async () => {
            try {
                const result = await api.get(`/teacher/get-assistance/${id}`)
                if (result.data.status) {
                    setExams(result.data.result)
                    console.log(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feacheData()


    }, [])

    return (
        <div>
            <div className='teacher-main-con'>
                <div className='add-teacher'>
                    <form className='add-teacher-con' onSubmit={handelSubmit}>
                        <div >
                            <div className='add-teacher-text'>Add Mark</div>
                            <div className='add-teacher-con1'>
                                <div className='add-teacher-inputs'>
                                    <input
                                        defaultValue={exams.assi1}
                                        onChange={e => setMark({ ...mark, assi1: e.target.value })}
                                        placeholder= 'Assignment 1'
                                        type='text'
                                    />
                                </div>

                                <div className='add-teacher-inputs'>
                                    <input
                                    defaultValue={exams.assi2}
                                        onChange={e => setMark({ ...mark, assi2: e.target.value })}
                                        placeholder='Assignment 2'

                                    />
                                </div>

                                <div className='add-teacher-inputs'>
                                    <input
                                    defaultValue={exams.midterm}
                                        onChange={e => setMark({ ...mark, midterm: e.target.value })}
                                        placeholder='Mid Exam'
                                        type='text'
                                    />
                                </div>


                                <div className='add-teacher-inputs'>
                                    <input
                                    defaultValue={exams.final}
                                        onChange={e => setMark({ ...mark, final: e.target.value })}
                                        placeholder='Final'
                                        type='text'
                                    />
                                </div>
                            </div>
                            <div className='add-teacher-button'>
                                <button>Add Mark</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default AddMarke
