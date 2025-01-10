import React, { useEffect, useState } from 'react'
import '../subject/subject.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../src/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Class() {

    const [section, setSection] = useState([]);
    useEffect(() => {

        feachdata()

    }, [])
    
    const [isLoading, setIsLoading] = useState(true)

    const feachdata = async () => {
        try {
            const result = await api.get('/auth/get-class');
            if (result.data.status) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                setSection(result.data.result);
            } else {
                console.error('Error fetching teachers:', result.data.error);
            }
        } catch (err) {
            console.log(err)
        }

    }

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
                    }).then( async(result) => {
                        if (result.isConfirmed) {
                            const responce = await api.delete(`/auth/class-delete/${id}`);

                            if(responce.data.status) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your file has been deleted.",
                                    icon: "success"
                                });
                                feachdata()
                            }
                        }
                    })

            } catch (err) {
                console.error(err);
            }
        }
        fetchDelete();
    }
    return (
        <div className='subject-main-table-con'>

            <div className="subject-main-container">
                <h3>Classes</h3>
                <div className="add-subject-button">
                    <Link to={'/admin-dashbord/add-class'}>Add Class</Link>
                </div>
                <div className="subject-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>class</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                section.map((c) => (

                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.class_name}</td>

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

export default Class
