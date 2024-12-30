import React, { useEffect, useState } from 'react'
import '../admin/navCss/nav.css'
import api from '../../src/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';



function AdminProfile() {
    const [adminInfo, setAdminInfo] = useState([])

    useEffect(() => {
        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-admin')
                if (result.data.status) {
                    console.log(result.data.admin.image)
                    setAdminInfo(result.data.admin)
                } else {
                    console.log(result.data.messaga)
                }
            } catch (err) {
                console.error(err.messaga)
            }
        }
        fechData()
    }, [])

    return (
        <div className='admin-profile-container'>
            <div className='admin-profile-con'>
                <div className='admin-profile-con1'>
                    
                    <div className='admin-image'>
                    <div className='admin-profile-text'>Admin Profile</div>
                        <img src={`http://localhost:3032/image/${adminInfo.image}`} alt="" srcset="" />
                        <div><Link to={`/admin-dashbord/edit-admin/${adminInfo.id}`} style={{ color: 'red' }}><FontAwesomeIcon icon={faPenToSquare} />edit</Link></div>
                    </div>

                    <div className='admin-profile-info'>
                        <div> <strong>Name: </strong>{adminInfo.name}</div>
                        <div><strong>Email: </strong>{adminInfo.email}</div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdminProfile
