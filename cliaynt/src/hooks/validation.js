import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


const useValidation = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const validate = async () => {

            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/admin-login');
                return;
            }

            try {
                

                const result = await api.post('/auth/vlidate', { token })

                if (!result.data.valid) {
                    throw new Error('invalid token')
                }
            } catch (err) {
                navigate('/admin-login')
            }
        }
        validate()
    },[navigate])
}

export default useValidation

