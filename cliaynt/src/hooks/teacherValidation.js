import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


const teacherValidation = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const validate = async () => {

            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/techer-login');
                return;
            }

            try {
                

                const result = await api.post('/teacher/vlidate', { token })

                if (!result.data.valid) {
                    throw new Error('invalid token')
                }
            } catch (err) {
                navigate('/teacher-login')
            }
        }
        validate()
    },[navigate])
}

export default teacherValidation

