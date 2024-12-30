import React, { useEffect, useState } from 'react'
import '../../../admin/subject/subject.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from '../../../../src/api';

function StudentList() {
    const [students , setStudents] = useState([])

    useEffect(() => {

        const feachData = async () => {
            try {
                const result =  await api.get('/teacher/get-student')

                if(result.data.status) {
                    setStudents(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch(err) {
                console.log(err)
            }
        }

    }, [])
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
                    <div className='add-subject-button'>
                        <Link to={'/admin-dashbord/add-student'}>Add Student</Link>
                    </div>
                    <div className='subject-table-con'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Section</th>
                                    <th>Gender</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>


                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <Link to={`/admin-dashbord/enter-parent`} style={{ color: '#FFB200' }}><FontAwesomeIcon icon={faCircleInfo} /></Link>
                                    </td>

                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default StudentList
