import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import api from '../../../src/api';
import Swal from 'sweetalert2';

function Teacher() {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        

        fetchTeachers();
    }, []);

    const [isLoading, setIsLoading] = useState(false)

    const fetchTeachers = async () => {
        setIsLoading(true)
        try {
            const result = await api.get('/auth/get-teacher');
            if (result.data.status) {
                setTeachers(result.data.result);
            } else {
                console.error('Error fetching teachers:', result.data.error);
            }
        } catch (err) {
            console.error('Error fetching teachers:', err.message);
        } finally {
            setIsLoading(false)
        }
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }

    const handelDelete = (id) => {
        const fetchDelete = async () => {
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
                            const responce = await api.delete(`/auth/teacher-delete/${id}`);
                            if (responce.data.status) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your file has been deleted.",
                                    icon: "success"
                                });
                                fetchTeachers()
                            } else {
                                console.error(err.message)
                            }
                        }
                    });
                

            } catch (err) {
                console.error(err);
            }
        }
        fetchDelete();
    }

    return (
        <div className='add-account-main'>
            <div className='serch-bar'>
                <input

                    placeholder='Search...'

                />
                <div className='serch-icone'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
            </div>
            <div className="subject-main-container">
                <h4>Teachers</h4>
                <div className="add-subject-button">
                    <Link to={'/admin-dashbord/add-teacher'}>Add Teacher</Link>
                </div>
                <div className="subject-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Section</th>
                                <th>Subject</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>{teacher.id}</td>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.class_name}</td>
                                    <td>{teacher.subject_name}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.phone}</td>
                                    <td>{teacher.address}</td>
                                    <td>
                                        <span onClick={() => handelDelete(teacher.id)} style={{ color: '#FA4032', cursor: 'pointer', marginRight: "10px" }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </span>

                                        <Link to={`/admin-dashbord/edit-teacher/${teacher.id}`} style={{ cursor: 'pointer', color: '#0C1844' }}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Teacher;
