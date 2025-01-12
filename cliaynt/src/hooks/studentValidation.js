import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


const studentValidation = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const validate = async () => {

            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/student-login');
                return;
            }

            try {
                

                const result = await api.post('/student/vlidate', { token })

                if (!result.data.valid) {
                    throw new Error('invalid token')
                }
            } catch (err) {
                navigate('/student-login')
            }
        }
        validate()
    },[navigate])
}

export default studentValidation

