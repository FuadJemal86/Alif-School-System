import React, { useState } from 'react';
import '../forgotpassword/forgot.css';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../src/api';

function ForgotEmail() {
    const [formData, setFormData] = useState({
        email: '',
        userType: '', // Tracks selected user type: 'teacher', 'student', or 'admin'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            userType: e.target.checked ? e.target.value : '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.userType) {
            toast.error('Please enter an email and select a user type.');
            return;
        }

        try {
            let endpoint;
            switch (formData.userType) {
                case 'admin':
                    endpoint = '/auth/check-email';
                    break;
                case 'teacher':
                    endpoint = '/teacher/check-email';
                    break;
                case 'student':
                    endpoint = '/student/check-email';
                    break;
                default:
                    toast.error('Invalid user type.');
                    return;
            }

            const result = await api.post(endpoint, { email: formData.email });
            if (result.data.status) {
                toast.success('Enter verification code');
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="teacher-main-con">
                <div className="add-teacher">
                    <form className="add-teacher-con" onSubmit={handleSubmit}>
                        <div>
                            <div className="add-teacher-text">Enter Email</div>
                            <div className="add-teacher-con1">
                                <div className="add-teacher-inputs">
                                    <input
                                        name="email"
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        type="text"
                                        value={formData.email}
                                    />
                                </div>
                            </div>
                            <div className="forgot-main">
                                <div className="forgot-input">
                                    <input
                                        type="checkbox"
                                        value="teacher"
                                        checked={formData.userType === 'teacher'}
                                        onChange={handleCheckboxChange}
                                    />
                                    <div className="forgot-text">Teacher</div>
                                </div>
                                <div className="forgot-input">
                                    <input
                                        type="checkbox"
                                        value="student"
                                        checked={formData.userType === 'student'}
                                        onChange={handleCheckboxChange}
                                    />
                                    <div className="forgot-text">Student</div>
                                </div>
                                <div className="forgot-input">
                                    <input
                                        type="checkbox"
                                        value="admin"
                                        checked={formData.userType === 'admin'}
                                        onChange={handleCheckboxChange}
                                    />
                                    <div className="forgot-text">Admin</div>
                                </div>
                            </div>
                            <div className="add-teacher-button">
                                <button type="submit">Insert</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotEmail;
