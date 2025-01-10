import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../subject/subject.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../src/api';
import Swal from 'sweetalert2';

function Parent() {

    const [parent, setParent] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        fechData()
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, [])

    const fechData = async () => {
        try {
            const result = await api.get('/auth/get-parent')
            if (result.data.status) {
                setParent(result.data.result)
            } else {
                console.log(result.data.error)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    const handelDelete = async(id) => {

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
                    const responce = await api.delete(`/auth/delete-parent/${id}`);

                    if (responce.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        fechData()
                    }

                } else {
                    console.error(err.message)
                }

            });

        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
            return (
                <div className="loading-spinner">
                    <span class="loader"></span>
                </div>
            );
        }


    return (
        <div className='subject-main-table-con'>
            <div className="subject-main-container">
                <h4>Parent</h4>
                <div className="subject-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>student</th>
                                <th>parent</th>
                                <th>Gender</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                parent.map((c) => (

                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.student_name}</td>
                                        <td>{c.name}</td>
                                        <td>{c.gender}</td>


                                        <td>
                                            <span onClick={() => handelDelete(c.id)} style={{ color: '#FA4032', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </span>
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

export default Parent
