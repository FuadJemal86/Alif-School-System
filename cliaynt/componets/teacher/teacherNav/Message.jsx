import React, { useState } from 'react'
import '../../admin/teachers/teacher.css'
import { useEffect } from 'react'
import api from '../../../src/api'

function Message() {

    const [message, setMessage] = useState([])
    useEffect(() => {

        const feahData = async () => {
            try {
                const result = await api.get('/auth/get-message')
                if (result.data.status) {
                    setMessage(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feahData()

    }, [])

    
    return (
        <div>
            <div className='message-box-main'>
                {
                    message.map(c => (
                        <div className='message-box'>
                            <div className='message-box1'>
                                <div><strong>Notification:</strong> {c.message}</div>
                                <div><strong>Time:</strong> {c.time}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Message
