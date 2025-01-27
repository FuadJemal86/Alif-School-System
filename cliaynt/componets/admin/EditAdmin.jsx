import React, { useState, useEffect } from 'react';
import '../admin/navCss/nav.css';
import api from '../../src/api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

function EditAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [adminInfo, setAdminInfo] = useState({ name: '', password: '', image: null });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { data } = await api.get(`/auth/admin/${id}`);
                if (data.status) {
                    setAdminInfo({ name: data.admin.name, password: '', image: null });
                }
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchAdminData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', adminInfo.name);
        formData.append('password', adminInfo.password);
        formData.append('image', adminInfo.image);

        try {
            const result = await api.put(`/auth/edit-admin/${id}`, formData);
            if (result.data.status) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate('/admin-dashbord/admin-profile');
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.error(err.message);
            toast.error('An error occurred while updating the admin.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            setAdminInfo({ ...adminInfo, image: file });
        } else {
            toast.error('Invalid file format. Please upload a JPEG or PNG image.');
        }
    };

    return (
        <div className="admin-profile-container">
            <div className="add-teacher">
                <form className="add-teacher-con" onSubmit={handleSubmit}>
                    <div>
                        <div className="add-teacher-text">Edit Admin</div>
                        <div className="add-teacher-con1">
                            <div className="add-teacher-inputs">
                                <input
                                    value={adminInfo.name}
                                    onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
                                    placeholder="Name"
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="add-teacher-inputs">
                                <input
                                    value={adminInfo.password}
                                    onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })}
                                    placeholder="Password"
                                    type="password"
                                    required
                                />
                            </div>
                            <div className="add-teacher-inputs">
                                <input
                                    onChange={handleImageChange}
                                    placeholder="Profile"
                                    type="file"
                                    accept="image/*"
                                />
                                {adminInfo.image && (
                                    <img
                                        src={URL.createObjectURL(adminInfo.image)}
                                        alt="Preview"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="add-teacher-button">
                            <button disabled={!adminInfo.name || !adminInfo.password}>Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditAdmin;
