import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../src/api';
import toast, { Toaster } from 'react-hot-toast';
import { cache } from 'react';

function Attendance() {

    const [attendance, setAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await api.get('/teacher/get-attendance');

            if (result.data && result.data.status) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
                setAttendance(result.data.attendance);
            } else {
                console.log('Error: ', result.data.message || 'Failed to fetch students');
            }
        } catch (err) {
            console.error('An error occurred: ', err);
        }
    };


    const handleAttendance = async (student_id, class_id, subject_id, status) => {
        try {
            const result = await api.post('/teacher/take-attendance', {
                student_id,
                class_id,
                subject_id,
                status,
            });

            if (result.data.status) {
                toast.success(status);
                fetchData()
            } else {
                toast.error(result.data.message || "This didn't work.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating attendance.");
        }
    };

    const handlePresent = (student_id, class_id, subject_id) => {
        handleAttendance(student_id, class_id, subject_id, "Present");
    };

    const handleAbsent = (student_id, class_id, subject_id) => {
        handleAttendance(student_id, class_id, subject_id, "Absent");
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }



    return (
        <div>
            <div className='subject-main-table-con'>
                <div className='serch-bar'>
                    <input
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}

                        placeholder='Search...'

                    />
                    <div className='serch-icone'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                </div>
                <div className='subject-main-container'>
                    <h4>Students</h4>

                    <div className='subject-table-con'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Attendance</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    attendance.map(c => (
                                        <tr key={c.student_id}>
                                            <td>{c.student_id}</td>
                                            <td>{c.student_name}</td>
                                            <td>{c.student_gender}</td>
                                            <td>{c.attendance_status}</td>
                                            <td>
                                                {c.attendance_status !== '-' && c.attendance_status !== null ?(

                                                    <div style={{ display: 'flex', gap: "15px" }}><FontAwesomeIcon  style={{ color: '#16C47F', cursor: 'not-allowed' }} icon={faCheck} />
                                                        <FontAwesomeIcon  style={{ color: '#F93827', cursor: 'not-allowed' }} icon={faXmark} />
                                                    </div>

                                                ) : (
                                                <div style={{ display: 'flex', gap: "15px" }}><FontAwesomeIcon onClick={() => handlePresent(c.student_id, c.class_id, c.subject_id)} style={{ color: '#16C47F', cursor: 'pointer' }} icon={faCheck} />
                                                    <FontAwesomeIcon onClick={() => handleAbsent(c.student_id, c.class_id, c.subject_id)} style={{ color: '#F93827', cursor: 'pointer' }} icon={faXmark} />
                                                </div>
                                                )}

                                            </td>
                                        </tr>

                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}

export default Attendance
