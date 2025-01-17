// AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../admin/navCss/nav.css'
import api from '../../src/api';

const AdminProfile = () => {
    const [adminInfo, setAdminInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await api.get('/auth/get-admin');
                if (result.data.status) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);

                    setAdminInfo(result.data.admin);


                } else {
                    console.log(result.data.message)

                }

            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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
                    <h2>Admin Profile</h2>
                    <div className="profile-image-container">
                        <img
                            src={`http://localhost:3032/image/${adminInfo.image}`}
                            // alt={adminInfo.name}
                            className="profile-image"
                        />
                        <div className="status-indicator"></div>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{adminInfo.name}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{adminInfo.email}</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <Link
                        to={`/admin-dashbord/edit-admin/${adminInfo.id}`}
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
    );
};

export default AdminProfile;