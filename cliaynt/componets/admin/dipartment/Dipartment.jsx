import React, { useState } from 'react';
import '../subject/subject.css';
import { Link } from 'react-router-dom';
import api from '../../../src/api';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTrash ,faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function Dipartment() {

    const [department, setDepartment] = useState([])
    const [isLoading, setIsLoading] = useState(true)



    const feachData = async () => {
        try {
            const result = await api.get('/auth/get-dip')

            if (result.data.status) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                setDepartment(result.data.result)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useState(() => {
        feachData()

    }, [])

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }

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
                    const response = await api.delete(`/auth/dip-delete/${id}`)

                    if (response.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        feachData()

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
        <div className='add-account-main'>
            <div className='serch-bar'>
                <input

                    placeholder='Search...'

                />
                <div className='serch-icone'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
            </div>
            <div className='subject-main-table-con'>
                <div className="subject-main-container">
                    <h4>Dipartmen</h4>
                    <div className='add-subject-button'>
                        <Link to={'/admin-dashbord/add-dipartmen'}>Add Dipartment</Link>
                    </div>
                    <div className="subject-table-con">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    department.map((c) => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.dip_name}</td>
                                            <td>
                                                <Link onClick={() => handeDelete(c.id)} style={{ color: '#FA4032', cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faTrash} />
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

        </div>
    )
}

export default Dipartment
