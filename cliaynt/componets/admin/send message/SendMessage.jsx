import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import '../../admin/teachers/teacher.css'
import api from '../../../src/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function SendMessage() {

    const [messages, setMessages] = useState({
        message: '',
        time: ''
    })
    const [message, setMessage] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault()
        try {
            const result = await api.post('/auth/send-message', messages)
            if (result.data.status) {
                toast.success(result.data.message)

            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {

        feahData()

    }, [])

    const feahData = async () => {
        setIsLoading(true);
        try {
            const result = await api.get('/auth/get-message')
            if (result.data.status) {
                setMessage(result.data.result)
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }

    const handelDelete = async (id) => {

        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {



                if (result.isConfirmed) {
                    const responce = await api.delete(`/teacher/message-delete/${id}`);

                    if (responce.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        feahData()
                    }

                } else {
                    console.error(err.message)
                }

            });

        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }


    return (
        <div>
            <div className='teacher-main-con'>
                <div className='message-box-main'>
                    {
                        message.map(c => (
                            <div className='message-box'>
                                <div style={{ cursor: 'pointer' }} onClick={() => handelDelete(c.id)} className='message-trash'><FontAwesomeIcon style={{color:'red'}} icon={faTrash} /></div>
                                <div className='message-box1'>
                                    <div><strong>message:</strong> {c.message}</div>
                                    <div><strong>Time:</strong> {c.time}</div>
                                </div>
                            </div>

                        ))
                    }
                </div>

                <div className='add-teacher'>

                    <form className='add-teacher-con' onSubmit={handleSubmit}>
                        <div >
                            <div className='add-teacher-text'>Send Message</div>
                            <div className='add-teacher-con1'>
                                <div className='add-teacher-inputs'>
                                    <input
                                        onChange={e => setMessages({ ...messages, message: e.target.value })}
                                        placeholder='message'
                                        type='text'
                                    />
                                </div>

                                <div className='add-teacher-inputs'>
                                    <input
                                        onChange={e => setMessages({ ...messages, time: e.target.value })}
                                        placeholder='time'

                                    />
                                </div>
                            </div>

                            <div className='add-teacher-button'>
                                <button>
                                    send message</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
            </div>

        </div>
    )
}

export default SendMessage
