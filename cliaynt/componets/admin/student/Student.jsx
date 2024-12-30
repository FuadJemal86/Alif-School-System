import React, { useEffect, useState } from 'react'
import '../subject/subject.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'
import api from '../../../src/api';
import Swal from 'sweetalert2';

function Student() {

    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/auth/get-student');
                if (result.data.status) {
                    const sortedStudents = result.data.result.sort((a, b) =>
                        a.class_name.localeCompare(b.class_name) || a.name.localeCompare(b.name)
                    );
                    setStudents(sortedStudents);
                    setFilteredStudents(sortedStudents); // Show all students by default
                } else {
                    alert('not found', result.data.error);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = students.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const handeDelete = async (id) => {

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
                    const response = await api.delete(`/auth/delete-student/${id}`)

                    if (response.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        window.location.reload()

                    } else {
                        console.log(result.data.error)
                    }


                }
            });
        } catch (err) {
            console.log(err.message)
        }

    }


    return (
        <div className='subject-main-table-con'>
            <div className='serch-bar'>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}

                    placeholder='Search...'

                />
                <div className='serch-icone'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
            </div>
            <div className='subject-main-container'>
                <h4>Students</h4>
                <div className='add-subject-button'>
                    <Link to={'/admin-dashbord/add-student'}>Add Student</Link>
                </div>
                <div className='subject-table-con'>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Class</th>
                                <th>Dipartment</th>
                                <th>Address</th>
                                <th>Action</th>
                                <th>Parent</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                filteredStudents.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.gender}</td>
                                        <td>{c.class_name}</td>
                                        <td>{c.dip_name}</td>
                                        <td>{c.address}</td>
                                        <td>
                                            <span onClick={() => handeDelete(c.id)} style={{ color: '#FA4032', cursor: 'pointer', marginRight: '10px' }} ><FontAwesomeIcon icon={faTrash} /></span>

                                            <Link to={`/admin-dashbord/edit-student/${c.id}`} style={{ cursor: 'pointer', color: '#0C1844' }}><FontAwesomeIcon icon={faPenToSquare} /></Link>
                                        </td>
                                        <td>
                                            <Link to={`/admin-dashbord/enter-parent/${c.id}`} style={{ color: '#FFB200' }}><FontAwesomeIcon icon={faCircleInfo} /></Link>
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

export default Student
