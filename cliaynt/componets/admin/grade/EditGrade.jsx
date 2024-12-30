import React, { useState } from 'react';
import '../teachers/teacher.css';
import { useEffect } from 'react';
import api from '../../../src/api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';


function EditGrade() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [subject, setSubject] = useState([])
    const [studentGrade, setGrade] = useState({
        grade: '',
        subject_id: ''
    })

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/auth/get-subject')

                if (result.data.status) {
                    setSubject(result.data.result)
                } else {
                    console.error(result.data.error)

                }
            } catch (err) {
                console.error(err)
            }
        }

        feachData()

    }, [])

    const handelSubmit = async (e) => {


        e.preventDefault()

        const { grade, subject_id } = studentGrade;
        if (!grade || !subject_id) {
            return toast.error('place fill the requast fild')
        }

        try {
            Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const response = await api.put(`/auth/edit-grade/${id}`, studentGrade);

                    if (response.data.status) {
                        Swal.fire("Saved!", "", "success");
                        navigate('/admin-dashbord/grade')
                    } else {
                        console.log(result.data.error);
                    }


                } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                }
            });
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div>
            <ToastContainer />
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Edit Grade</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setGrade({ ...studentGrade, subject_id: e.target.value })
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
                                <select
                                    onChange={(e) =>
                                        setGrade({ ...studentGrade, grade: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Grade
                                    </option>

                                    <option>A+</option>
                                    <option>A</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B</option>
                                    <option>B-</option>
                                    <option>C+</option>
                                    <option>C</option>
                                    <option>C-</option>
                                    <option>D</option>
                                    <option>F</option>

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
    )
}

export default EditGrade
