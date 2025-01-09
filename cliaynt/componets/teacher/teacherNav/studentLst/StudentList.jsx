import React, { useEffect, useState } from 'react'
import '../../../admin/subject/subject.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from '../../../../src/api';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [section, setSection] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/teacher/teacher-data');

                if (result.data && result.data.status) {
                    // Assuming the response has class_students
                    setStudents(result.data.class_students); // Use 'class_students' from the response
                    setSection(result.data.subject_details);
                } else {
                    console.log('Error: ', result.data.message || 'Failed to fetch students');
                }
            } catch (err) {
                console.error('An error occurred: ', err);
            }
        };

        fetchData();
    }, []);

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
                    <div className='subject-table-con'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Section</th>
                                    <th>Gender</th>
                                    <th>Total Mark</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    students.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.name}</td>
                                            <td>{c.class_name}</td>
                                            <td>{c.gender}</td>
                                            <td>{c.average}</td>
                                            <td>
                                                {c.average !== null && c.average !==0 ? (
                                                    <Link
                                                        to={`/teacher-nav/add-grade/${c.id}`}
                                                        style={{ color: '#89A8B2' }}
                                                    >
                                                        <FontAwesomeIcon icon={faCircleInfo} />
                                                    </Link>
                                                ) : (
                                                    <span style={{ color: '#89A8B2', cursor: 'not-allowed' }}>
                                                        <FontAwesomeIcon icon={faCircleInfo} />
                                                    </span>
                                                )}

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

export default StudentList
