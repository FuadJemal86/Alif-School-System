import React from 'react'
import '../subject/subject.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import api from '../../../src/api';
import { Link } from 'react-router-dom';
import {  faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function AddParent() {

    const [student, setStudent] = useState([])

    useEffect(() => {

        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-student')

                if (result.data.status) {
                    setStudent(result.data.result)
                } else {
                    console.error(err.data.error)
                }
            } catch (err) {
                console.error(err.message)
            }
        }

        fechData()


    }, [])
    return (
        <div className='subject-main-table-con'>
            <div className="subject-main-container">
                <h4>Students</h4>
                <div className="subject-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Add Parent</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                student.map((c) => (

                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.gender}</td>


                                        <td>
                                            <Link to={'/admin-dashbord/enter-parent'} style={{ color: '#FA4032', cursor: 'pointer' }}>
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

export default AddParent
