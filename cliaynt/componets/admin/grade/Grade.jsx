import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import api from '../../../src/api';
import Swal from 'sweetalert2';
import '../subject/subject.css'


function Grade() {

    const [studentInfo, setStudentInfo] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [serchItem, setSerchItem] = useState('')


    useEffect(() => {
        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-grade')
                if (result.data.status) {
                    const sortedStudents = result.data.result.sort((a, b) =>
                        a.student_name.localeCompare(b.student_name) || a.grade.localeCompare(b.grade)
                    );
                    setStudentInfo(sortedStudents)
                    setFilteredStudents(sortedStudents)
                } else {
                    console.log(result.data.error)
                }
            } catch (err) {
                console.error(err.message)
            }
        }

        fechData()

    }, [])

    useEffect(() => {
        const filterd = studentInfo.filter((students) => 
            students.student_name.toLowerCase().includes(serchItem.toLowerCase())
        )
        setFilteredStudents(filterd)
    },[serchItem,studentInfo])

    const handelDelete = async (id) => {
        try {

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {

                    const response = await api.delete(`/auth/delete-grade/${id}`);
                    if (response.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        window.location.reload()
                    } else {
                        console.error(err.message)
                    }
                }
            });
        } catch (err) {
            console.error(err.message)
        }
    }
    return (
        <div className='subject-main-table-con'>
            <div className='serch-bar'>
                <input
                    value={serchItem}
                    onChange={(c) => setSerchItem(c.target.value)}
                    placeholder='Search...'

                />
                <div className='serch-icone'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
            </div>
            <div className="subject-main-container">
                <h4>Student Grade</h4>
                <div className="add-subject-button">
                    <Link to={'/admin-dashbord/ajest-grade'}>Grade</Link>
                </div>
                <div className="subject-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Subject</th>
                                <th>Grade</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredStudents.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.student_name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.gender}</td>
                                        <td>{c.subject_name}</td>
                                        <td>{c.grade}</td>

                                        <td>
                                            <span onClick={() => handelDelete(c.id)} style={{ color: '#FA4032', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </span>

                                            <Link to={`/admin-dashbord/edit-grade/${c.id}`} style={{ color: '#0C1844', cursor: 'pointer', marginLeft: '10px' }}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </Link>
                                        </td>
                                    </tr>

                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}

export default Grade
