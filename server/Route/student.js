const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
require('dotenv').config()



const router = express.Router();

router.post('/login', async (req, res) => {
    const sql = 'SELECT * FROM students WHERE email = ? AND password = ?';

    try {
        connection.query(sql, [req.body.email, req.body.password], (err, result) => {
            if (err) {
                throw err;
            }
            if (result.length > 0) {
                const studentId = result[0].id;

                const token = jwt.sign(
                    { student: true, email: result[0].email, id: studentId },
                    process.env.STUDENT_KEY,
                    { expiresIn: '30' })

                return res.status(200).json({ token: token , loginstatus:true })
            } else {
                console.log('wrong password or username')
                return res.status(400).json({ state: false , error : 'wrong password or username'})
            }
        })

    } catch(err) {
        console.error(err.messge)

        return res.status(400).json({ state:false , error : err.message})
    }
})

// get grade

router.get('/get-grade', async(req, res)=> {
    const sql = 'SELECT * FROM grades'

    try{
        connection.query(sql,(err,result) => {
            if(err) {
                throw err
            }
            return res.status(200).json({status : true, result})
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({status : false ,error : err.message})
    }
})

module.exports = {student:router}

