import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../../src/api'

function PasswordVerfication() {

    const [verfication , setVefication] = useState({
        email:'',
        verfication:''
    })

    const handelSubmit = async(e) => {
        
        e.preventDefualt()

        try {
            const result = await api.post('/teacher/verify-code',verfication);
            if(result.data.status) {

            } else {
                toast.error(result.data.message)
            }
        } catch(err) {
            console.log(err)
        }

    }
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="teacher-main-con">
                <div className="add-teacher">
                    <form className="add-teacher-con" onSubmit={handelSubmit}>
                        <div>
                            <div className="add-teacher-text">Enter Email</div>
                            <div className="add-teacher-con1">
                                <div className="add-teacher-inputs">
                                    <input
                                        name="email"
                                        onChange={e => setVefication({email : e.target.value})}
                                        placeholder="Email"
                                        type="text"
                                        // value={formData.email}
                                    />
                                </div>
                            </div>

                            <div className="add-teacher-con1">
                                <div className="add-teacher-inputs">
                                    <input
                                        name="Verfication"
                                        onChange={e => setVefication({verfication : e.target.value})}
                                        placeholder="Verfication"
                                        type="text"
                                        // value={formData.email}
                                    />
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
    )
}

export default PasswordVerfication
