import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../src/api';
import { useNavigate } from 'react-router-dom';
import '../forgotpassword/forgot.css';

function ForgotPassword() {
    const navigate = useNavigate();
    const [notAllowed, setNotAllode] = useState(false)
    const [step, setStep] = useState(1); // Step tracker: 1 - Email, 2 - Verification, 3 - Reset Password
    const [formData, setFormData] = useState({
        email: '',
        userType: '', // Tracks selected user type: 'teacher', 'student', or 'admin'
        verificationCode: '', // For verification step
        newPassword: '', // For resetting the password
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
        setNotAllode(true)

        if (step === 1) {
            // Step 1: Email submission
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
                    
                    toast.success('Verification code sent to your email.');
                    setStep(2); // Proceed to the next step
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred. Please try again.');
            } finally {
                setNotAllode(false)
            }
        } else if (step === 2) {
            // Step 2: Verification code submission
            if (!formData.verificationCode) {
                toast.error('Please enter the verification code.');
                return;
            }
            setNotAllode(true)

            try {
                let verifyEndpoint;
                switch (formData.userType) {
                    case 'admin':
                        verifyEndpoint = '/auth/verify-code';
                        break;
                    case 'teacher':
                        verifyEndpoint = '/teacher/verify-code';
                        break;
                    case 'student':
                        verifyEndpoint = '/student/verify-code';
                        break;
                    default:
                        toast.error('Invalid user type.');
                        return;
                }

                const result = await api.post(verifyEndpoint, {
                    email: formData.email,
                    verificationCode: formData.verificationCode,
                });

                if (result.data.status) {
                    toast.success('Verification successful! Proceed to reset your password.');
                    setStep(3); // Proceed to the reset password step
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred. Please try again.');
            } finally {
                setNotAllode(false)
            }
        } else if (step === 3) {
            // Step 3: Reset password
            if (!formData.newPassword) {
                toast.error('Please enter a new password.');
                return;
            }
            setNotAllode(true)

            try {
                let resetEndpoint;
                switch (formData.userType) {
                    case 'admin':
                        resetEndpoint = '/auth/reset-password';
                        break;
                    case 'teacher':
                        resetEndpoint = '/teacher/reset-password';
                        break;
                    case 'student':
                        resetEndpoint = '/student/reset-password';
                        break;
                    default:
                        toast.error('Invalid user type.');
                        return;
                }

                const result = await api.put(resetEndpoint, {
                    email: formData.email,
                    newPassword: formData.newPassword,
                });

                if (result.data.status) {

                    toast.success('Password reset successful! Redirecting...');
                    navigate('/techer-login');
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred. Please try again.');
            } finally {
                setNotAllode(false)
            }
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="teacher-main-con">
                <div className="add-teacher">
                    <form className="add-teacher-con" onSubmit={handleSubmit}>
                        <div>
                            {step === 1 && (
                                <>
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
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div className="add-teacher-text">Enter Verification Code</div>
                                    <div className="add-teacher-con1">
                                        <div className="add-teacher-inputs">
                                            <input
                                                name="verificationCode"
                                                onChange={handleInputChange}
                                                placeholder="Verification Code"
                                                type="text"
                                                value={formData.verificationCode}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <div className="add-teacher-text">Reset Password</div>
                                    <div className="add-teacher-con1">
                                        <div className="add-teacher-inputs">
                                            <input
                                                name="newPassword"
                                                onChange={handleInputChange}
                                                placeholder="New Password"
                                                type="password"
                                                value={formData.newPassword}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="add-teacher-button">
                                {
                                    notAllowed ? (
                                        <button type="submit" style={{ cursor: 'not-allowed' }}>
                                            whet...
                                        </button>
                                    ) : (
                                        <button type="submit">
                                            {step === 1 ? 'Send Code' : step === 2 ? 'Verify Code' : 'Reset Password'}
                                        </button>
                                    )
                                }

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
