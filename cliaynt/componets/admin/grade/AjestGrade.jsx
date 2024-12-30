import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import api from '../../../src/api';

function AjestGrade() {

    const [studentInfo, setStudentInfo] = useState([]);

    useEffect(() => {
        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-student');
                if (result.data.status) {
                    
                    const sortedData = result.data.result.sort((a, b) =>
                        a.class_name.localeCompare(b.class_name) || a.name.localeCompare(b.name)
                    );
                    setStudentInfo(sortedData)
                } else {
                    console.log(result.data.error)
                }
            } catch (err) {
                console.error(err.message)
            }
        }

        fechData()

    }, [])

    return (
        <div>
            <div className="subject-main-container">
                <div className="add-subject-button">
                </div>
                <div className="subject-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Section</th>
                                <th>Gender</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentInfo.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.class_name}</td>
                                        <td>{c.gender}</td>

                                        <td>
                                            <Link to={`/admin-dashbord/enter-grade/${c.id}`} style={{ color: '#0C1844', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faCircleInfo} />
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

export default AjestGrade
