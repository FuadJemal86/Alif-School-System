import React, { useEffect, useState } from 'react'
import '../../../admin/subject/subject.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from '../../../../src/api';

function Assisment() {
    const [assistenses, setAssistance] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        const feacheData = async () => {
            setIsLoading(true);
            try {
                const result = await api.get('/teacher/get-assistence')
                if (result.data.status) {
                    setAssistance(result.data.students)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        }

        feacheData()


    }, [])

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }

    return (
        <div>
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
                                        <th>Assignment 1</th>
                                        <th>Assignment 2</th>
                                        <th>Mideterm</th>
                                        <th>Final</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        assistenses.map(c => (
                                            <tr key={c.student_id}>
                                                <td>{c.student_id}</td>
                                                <td>{c.student_name}</td>
                                                <td>{c.assi1 || '-'}</td>
                                                <td>{c.assi2 || '-'}</td>
                                                <td>{c.midterm || '-'}</td>
                                                <td>{c.final || '-'}</td>
                                                <td>
                                                    {
                                                        (c.assi1 !== 0 && c.assi1 !== null &&
                                                            c.assi2 !== 0 && c.assi2 !== null &&
                                                            c.midterm !== 0 && c.midterm !== null &&
                                                            c.final !== 0 && c.final !== null) && (c.final != 0 || c.final != null) ? (

                                                            <Link style={{ color: '#89A8B2', cursor: 'not-allowed' }}><FontAwesomeIcon icon={faCircleInfo} /></Link>

                                                        ) : (

                                                            <Link to={`/teacher-nav/add-mark/${c.student_id}`} style={{ color: '#89A8B2' }}><FontAwesomeIcon icon={faCircleInfo} /></Link>
                                                        )
                                                    }
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
        </div>
    )
}

export default Assisment
