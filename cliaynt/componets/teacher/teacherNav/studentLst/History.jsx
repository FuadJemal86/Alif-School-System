import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../src/api';

function History() {

    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await api.get('/teacher/get-history');

            if (result.data.status) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
                setHistory(result.data.history);
            } else {
                console.log('Error: ', result.data.message || 'Failed to fetch students');
            }
        } catch (err) {
            console.error('An error occurred: ', err);
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
            <div className='subject-main-table-con'>
                <div className='serch-bar'>
                                <input
                                    
                                    
                
                                    placeholder='Search...'
                
                                />
                                <div className='serch-icone'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                            </div>
                <div className='subject-main-container'>
                    <h4>Attendance History</h4>

                    <div className='subject-table-con'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Absent Day</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    history.map(c => (
                                        <tr key={c.student_id}>
                                            <td>{c.student_id}</td>
                                            <td>{c.student_name}</td>
                                            <td>{c.attendance_date}</td>
                                            <td>{c.absent_count}</td>
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

export default History
