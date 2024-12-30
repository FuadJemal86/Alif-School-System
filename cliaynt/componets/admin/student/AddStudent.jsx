import React, { useState } from 'react'
import '../teachers/teacher.css'
import { useEffect } from 'react'
import api from '../../../src/api'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dipartment from '../dipartment/Dipartment';

function AddStudent() {
    const navigate = useNavigate()
    const [section, setSection] = useState([])
    const [student, setStudent] = useState({
        name: '',
        class_id: '',
        password: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        image: '',
        gender:'',
        dip_id:''

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

        api.post('/auth/send-email-student', { email, name, password })
            .then(response => {
                if (response.data.Status) {

                } else {
                    alert('Failed to send email');
                }
            })
            .catch(err => console.error('Error sending email:', err));
    };

    useEffect(() => {

        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-class-section')
                if (result.data.status) {
                    setSection(result.data.result)

                } else {
                    alert('the class is not found', result.data.error)
                }
            } catch (err) {
                console.log(err.message)
            }
        }

        fechData()
    }, [])

    const handelSubmit = async (e) => {


        e.preventDefault()

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', student.name);
        formData.append('class_id', student.class_id);
        const newPassword = generatePassword();
        formData.append('password', newPassword);
        formData.append('email', student.email);
        formData.append('phone', student.phone);
        formData.append('address', student.address);
        formData.append('dip_id', student.dip_id);
        formData.append('image', student.image);
        formData.append('gender', student.gender);

        const { name, email, class_id, dob, phone, gender, parent } = student;
        if (!name || !email || !class_id || !dob || !phone || !gender) {
            return toast.error("Please fill in all required fields.");
        };

        try {
            const result = await api.post('/auth/add-student',formData)

            if (result.data.status) {

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Student added successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/admin-dashbord/student')
                handleEmail(student.email, student.name, newPassword)


            } else {
                console.log(result.data.error)
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.error || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.error(err.message)
            toast.error("An error occurred while adding the student.");
        }
    }

    const [dipartment , setDepartment] = useState([])

    useState(() => {
        const feachData = async() => {
            try {
                const result = await api.get('/auth/get-dip')

                if(result.data.status) {
                    setDepartment(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch(err) {
                console.log(err)
            }
        }
        feachData()

    } , [])

    return (
        <div>
            <div className='add-teacher'>
                <form className='add-teacher-con' onSubmit={handelSubmit}>
                    <div >
                        <div className='add-teacher-text'>Add Student</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudent({ ...student, name: e.target.value })}
                                    placeholder='name'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <select

                                    onChange={(e) =>
                                        setStudent({ ...student, gender: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Gender
                                    </option>
                                    <option>
                                        Male
                                    </option>
                                    <option>
                                        Female
                                    </option>
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setStudent({ ...student, class_id: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a class
                                    </option>
                                    {
                                        section.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.class_name}
                                            </option>
                                        ))
                                    }


                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    onChange={(e) =>
                                        setStudent({ ...student, dip_id: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Dipartment
                                    </option>
                                    {
                                        dipartment.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.dip_name}
                                            </option>
                                        ))
                                    }

                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudent({ ...student, email: e.target.value })}
                                    placeholder='email'

                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudent({ ...student, phone: e.target.value })}
                                    placeholder='phone'
                                    type='text'
                                />
                            </div>


                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudent({ ...student, address: e.target.value })}
                                    placeholder='address'
                                    type='text'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudent({ ...student, dob: e.target.value })}
                                    placeholder='dob'
                                    type='date'
                                />
                            </div>

                            <div className='add-teacher-inputs'>
                                <input
                                    onChange={e => setStudent({ ...student, image: e.target.files[0] })}
                                    placeholder='parent conatct'
                                    type='file'
                                />
                            </div>
                        </div>
                        <div className='add-teacher-button'>
                            <button>Add Student</button>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />

        </div>
    )
}

export default AddStudent
