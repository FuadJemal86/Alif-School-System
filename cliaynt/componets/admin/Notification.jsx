import React, { useEffect, useState } from 'react'
import '../admin/navCss/nav.css'
import api from '../../src/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Notification() {

    const [notification, setNotification] = useState([])

    useEffect(() => {
        const fechData = async () => {
            try {
                const result = await api.get('/auth/get-messaga')

                if (result.data.status) {
                    setNotification(result.data.result)
                } else {
                    console.log(result.data.error)
                }

            } catch (err) {
                console.log(err)
            }
        }
        fechData()
    }, [])

    const handelDelete = async (id) => {
        try {
            const result = await api.delete(`/auth/delete-message/${id}`)

            if (result.data.status) {
                window.location.reload()
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const [notificationCount, setNotificationCount] = useState();

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/auth/count-message')
                if (result.data.status) {
                    console.log(result.data.result[0].messags)
                    setNotificationCount(result.data.result[0].messags)
                } else {
                    console.log(result.data.messaga)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachData()

    }, [])

    return (
        <div>
            <div className='notifi-box'>
                {
                    notification.map((c) => (
                        <div className='notifi-box1'>

                            <div className='notifi-box2'>

                                <div><strong>Name</strong> :  {c.name}</div>
                                <div><strong>Email</strong> :  {c.email}</div>
                                <div><strong>Message</strong> : {c.message}</div>
                            </div>
                            <div className='notification-delete'>
                                <button onClick={() => handelDelete(c.id)}>
                                    <FontAwesomeIcon style={{ color: 'FF4C4C' }} icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
            {notificationCount == 0 && (
                <div
                    style={{
                        textAlign:'center',
                        marginTop: '10px',
                        color: '#555',
                        fontSize: '15px',
                        fontStyle: 'italic',
                    }}
                >
                    No notifications
                </div>
            )}
        </div>
    )
}

export default Notification
