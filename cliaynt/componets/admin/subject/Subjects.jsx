import React, { useState } from 'react'
import '../subject/subject.css'
import { data, Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../src/api'
import Swal from 'sweetalert2'



function Subjects() {
    const [subject, setSubject] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/auth/get-subject');
                if (result.data.status) {
                    setSubject(result.data.result)
                } else {
                    console.error('Error fetching data:', result.data.error);
                }

            } catch (err) {
                console.error(err)
            }
        }
        fetchData()

    }, [])

    const handelDelete = (id) => {

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
                    const responce = await api.delete(`/auth/subject-delete/${id}`);

                    if (responce.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        window.location.reload()
                    }

                } else {
                    console.error(err.message)
                }

            });

        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className='subject-main-table-con'>
            <div className='subject-main-container'>
                <h4>Subjects</h4>
                <div className='add-subject-button'>
                    <Link to={'/admin-dashbord/add-subject'}>Add Subject</Link>
                </div>
                <div className='subject-table-con'>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                subject.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.description}</td>

                                        <td>
                                            <span style={{ color: '#FA4032', cursor: 'pointer' }} onClick={() => handelDelete(c.id)}><FontAwesomeIcon icon={faTrash} /></span>
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

export default Subjects
