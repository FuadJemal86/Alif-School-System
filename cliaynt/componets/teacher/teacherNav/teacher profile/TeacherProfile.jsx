import React, { useEffect, useState } from 'react';
import '../../../admin/navCss/nav.css';
import { Link } from 'react-router-dom';
import api from '../../../../src/api';

function TeacherProfile() {

    const [teacherInfo, setTeacherInfo] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        feachData()

    }, [])

    const feachData = async () => {
        setIsLoading(true);
        try {
            const result = await api.get('/teacher/get-teacher-profile')
            if (result.data.status) {
                setTeacherInfo(result.data.teacher)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }

    }

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return (
        <div className="admin-profile-container">
                    <div className="admin-profile-card">
                        <div className="profile-header">
                            <h2>Teacher Profile</h2>
                            <div className="profile-image-container">
                                <img
                                    src={`https://fuad.jmcpharma.com/image/${teacherInfo.image}`}
                                    // alt={adminInfo.name}
                                    className="profile-image"
                                />
                                <div className="status-indicator"></div>
                            </div>
                        </div>
        
                        <div className="profile-info">
                            <div className="info-item">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{teacherInfo.name}</span>
                            </div>
        
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{teacherInfo.email}</span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">Subject:</span>
                                <span className="info-value">{teacherInfo.subject_name}</span>
                            </div>
                        </div>
        
                        <div className="profile-actions">
                            <Link
                                to={`/teacher-nav/edit-teacher/${teacherInfo.id}`}
                                className="edit-button"
                            >
                                <svg
                                    className="edit-icon"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
    )
}

export default TeacherProfile
