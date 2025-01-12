import React, { useEffect, useState } from 'react'
import api from '../../../../src/api';
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

function StudentGrade() {



    const { id } = useParams()
    const [section, setSubject] = useState([])
    const [student, setStudent] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [grades, setGreade] = useState({
        student_id: '',
        subject_id: '',
        grade: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/teacher/teacher-data');

                if (result.data && result.data.status) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                    setSubject(result.data.subject_details);
                } else {
                    console.log('Error: ', result.data.message || 'Failed to fetch students');
                }
            } catch (err) {
                console.error('An error occurred: ', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fechStudent = async () => {
            try {
                const result = await api.get(`/teacher/get-student/${id}`)

                if (result.data.status) {
                    setStudent(result.data.result[0])
                    setGreade((prevGrade) => ({ ...prevGrade, student_id: result.data.result[0]?.id }));
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fechStudent()
    }, [])

    const handelSubmit = async (e) => {
        e.preventDefault()

        const {subject_id, grade } = grades

        if ( !subject_id || !grade) {
            return toast.error('Missing Request!')
        }

        try {
            const result = await api.post('/teacher/add-grade', grades)
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1550
                });

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }

        } catch (err) {
            console.log(err)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Something went wrong!',
                showConfirmButton: true,
            });
        }
    }

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Grade</div>
                        <div className='add-teacher-con1'>

                            <div className='add-teacher-inputs'>
                                <input
                                    placeholder={student.name}
                                    type='text'
                                    readOnly
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setGreade({ ...grades, subject_id: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>
                                    {
                                        section.map(c => (
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
                                        setGreade({ ...grades, grade: e.target.value })
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
                            <button>Insert</button>
                        </div>
                    </div>
                </form>
            </div>

            <Toaster
                position="top-center" // Position of the toast
                reverseOrder={false} // Keep toasts in the order they were added
            />

        </div>
    )
}

export default StudentGrade
