import React from 'react';
import '../subject/subject.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../src/api';


function AddSubject() {
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [subject, setSubject] = useState({
        name: '',
        description: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!subject.name || !subject.description) {
            setError('Both fields are required.');
            return;
        }
        api.post('/auth/add-subjects', subject)
            .then(result => {
                if (result.data.status) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "subject saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate('/admin-dashbord/subject')
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: result.data.message || 'Something went wrong!',
                        showConfirmButton: true,
                    });
                }

            })
            .catch(err => {
                console.error(err);
                alert('An error occurred while adding the subject.');
            });

    }
    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handleSubmit}>
                    <div className='subject-main'>
                        <div className='add-teacher-text'>Add Subject</div>
                        <div className='subject-input '>
                            <div>{error}</div>
                            <div className='add-teacher-inputs mb-3'>
                                <input
                                    onChange={e => setSubject({ ...subject, name: e.target.value })}
                                    placeholder='subject name'
                                />
                            </div>

                            <div className='add-teacher-inputs mb-3'>
                                <input
                                    onChange={e => setSubject({ ...subject, description: e.target.value })}
                                    placeholder='description'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='add-teacher-button'>
                        <button type='submit' >Add Subject</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddSubject
