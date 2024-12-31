import React from 'react'
import '../teachers/teacher.css'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import api from '../../../src/api';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


function AddTeacher() {
    const navigate = useNavigate()
    const [subject, setSubject] = useState([])
    const [teacher, setTeacher] = useState({
        name: '',
        password: '',
        subject_id: '',
        class_id: '',
        email: '',
        phone: '',
        address: '',
        image: ''
    })

    const generatePassword = () => {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        const passwordLength = 8;
        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    };

    const handleEmail = (email, name, password) => {
        api.post('/auth/send-email', { email, name, password })
            .then(response => {
                if (response.data.Status) {
                    alert('send!')

                } else {
                    alert('Failed to send email');
                }
            })
            .catch(err => console.error('Error sending email:', err));
    };


    const handelSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', teacher.name);
        formData.append('subject_id', teacher.subject_id);
        formData.append('class_id', teacher.class_id);
        const newPassword = generatePassword();
        formData.append('password', newPassword);
        formData.append('email', teacher.email);
        formData.append('phone', teacher.phone);
        formData.append('address', teacher.address);
        formData.append('image', teacher.image);

        try {
            const result = await api.post('/auth/add-teacher', formData);

            if (result.data.status) {
                handleEmail(teacher.email, teacher.name, newPassword);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "teacher added successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                navigate('/admin-dashbord/teacher')

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message,
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/auth/get-subject');
                if (result.data.status) {
                    setSubject(result.data.result)
                } else {
                    console.error('Error fetching data:', result.data.error);
                }

            } catch (err) {
                console.error(err)
            }
        }
        fetchData()

    }, [])

    const [section, setSection] = useState([]);
    useEffect(() => {

        const feachdata = async () => {
            try {
                const result = await api.get('/auth/get-class');
                if (result.data.status) {
                    setSection(result.data.result);
                } else {
                    console.error('Error fetching teachers:', result.data.error);
                }
            } catch (err) {
                console.log(err)
            }

        }

        feachdata()

    }, [])

    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Add Teacher</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setTeacher({ ...teacher, name: e.target.value })}
                                    placeholder='name'
                                    type='text'
                                />
                            </div>


                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) => setTeacher({ ...teacher, class_id: e.target.value })}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a class
                                    </option>
                                    {section.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.class_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) => setTeacher({ ...teacher, subject_id: e.target.value })}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>
                                    {subject.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setTeacher({ ...teacher, email: e.target.value })}
                                    placeholder='email'

                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setTeacher({ ...teacher, phone: e.target.value })}
                                    placeholder='phone'
                                    type='text'
                                />
                            </div>


                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setTeacher({ ...teacher, address: e.target.value })}
                                    placeholder='address'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setTeacher({ ...teacher, image: e.target.files[0] })}
                                    placeholder='address'
                                    type='file'
                                />
                            </div>
                        </div>
                        <div className='add-teacher-button'>
                            <button>Add Teacher</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddTeacher
