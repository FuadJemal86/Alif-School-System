import React, { useEffect, useState } from 'react';
import '../teachers/teacher.css';
import Swal from 'sweetalert2';
import api from '../../../src/api';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudents] = useState({
        name: '',
        email: '',
        class_id: '',
        gender: '',
        dob: '',
        address: ''
    });

    const [studentClass, setClass] = useState([]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const result = await api.get(`/auth/get-student/${id}`);
                if (result.data.status) {
                    setStudents(result.data.result[0]);
                } else {
                    console.error(result.data.error);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchStudent();
    }, [id]);

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const result = await api.get('/auth/get-class');
                if (result.data.status) {
                    setClass(result.data.result);
                } else {
                    console.error(result.data.error);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchClass();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, class_name, gender, address } = student;

        if (!name || !email || !class_name || !gender || !address) {
            return toast.error('Please fill in all required fields');
        }

        try {
            const result = await api.put(`/auth/update-student/${id}`, student);
            if (result.data.status) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/admin-dashbord/student');
            } else {
                toast.error('Failed to update student');
            }
        } catch (err) {
            toast.error('An error occurred while updating the student');
            console.error(err);
        }
    };

    return (
        <div className="add-teacher">
            <form className="add-teacher-con" onSubmit={handleSubmit}>
                <div>
                    <div className="add-teacher-text">Edit Student</div>
                    <div className="add-teacher-con1">
                        <div className="add-teacher-inputs">
                            <input
                                value={student.name}
                                onChange={(e) => setStudents({ ...student, name: e.target.value })}
                                placeholder="Name"
                                type="text"
                                required
                            />
                        </div>

                        <div className="add-teacher-inputs">
                            <input
                                value={student.email}
                                onChange={(e) => setStudents({ ...student, email: e.target.value })}
                                placeholder="Email"
                                type="email"
                                required
                            />
                        </div>

                        <div className="add-teacher-inputs">
                            <select
                                value={student.class_name}
                                onChange={(e) => setStudents({ ...student, class_name: e.target.value })}
                                required
                            >
                                <option value="" disabled>
                                    Select Class
                                </option>
                                {studentClass.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.class_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="add-teacher-inputs">
                            <select
                                value={student.gender}
                                onChange={(e) => setStudents({ ...student, gender: e.target.value })}
                                required
                            >
                                <option value="" disabled>
                                    Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="add-teacher-inputs">
                            <input
                                value={student.dob}
                                onChange={(e) => setStudents({ ...student, dob: e.target.value })}
                                placeholder="Date of Birth"
                                type="date"
                                required
                            />
                        </div>

                        <div className="add-teacher-inputs">
                            <input
                                value={student.address}
                                onChange={(e) => setStudents({ ...student, address: e.target.value })}
                                placeholder="Address"
                                type="text"
                                required
                            />
                        </div>
                    </div>
                    <div className="add-teacher-button">
                        <button type="submit">Edit Student</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditStudent;
