import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faTrash, faPenToSquare, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Student from '../../../admin/student/Student';
import api from '../../../../src/api';

function GradeList() {

    const [grade, setGrade] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await api.get('/teacher/get-grade');

            if (result.data && result.data.status) {
                setGrade(result.data.result);
            } else {
                console.log('Error: ', result.data.message || 'Failed to fetch students');
            }
        } catch (err) {
            console.error('An error occurred: ', err);
        } finally {
            setIsLoading(false);
        }
    };

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
                                        <th>Subject</th>
                                        <th>Gender</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        grade.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.student_id}</td>
                                                <td>{c.student_name}</td>
                                                <td>{c.subject_name}</td>
                                                <td>{c.gender}</td>
                                                <td>{c.grade}</td>
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

export default GradeList
