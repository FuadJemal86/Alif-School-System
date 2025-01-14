const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const bcrypt = require('bcrypt')
require('dotenv').config()



const router = express.Router();

// verifing token

router.post('/vlidate', async (req, res) => {
    const { token } = req.body

    if (!token) {
        return res.status(400).send('token not provide')
    }

    try {
        jwt.verify(token, process.env.STUDENT_KEY)
        return res.status(200).json({valid:true})
    } catch(err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
})

// student login

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ status: false, message: 'Missing required fields' })
    }

    try {

        const sql = 'SELECT * FROM students WHERE email = ?';
        connection.query(sql, [req.body.email], async (err, result) => {
            if (err) {
                console.error("Database query error:", err.message);
                return res.status(500).json({ loginStatus: false, error: err.message })
            }

            if (result.length == 0) {
                return res.status(200).json({ localStatus: false, message: 'Wrong Email or Password' })

            }
            const studentId = result[0].id;
            const hashedPassword = result[0].password;

            const isPasswordValid = await bcrypt.compare(password, hashedPassword);

            if (!isPasswordValid) {
                return res.status(200).json({ loginStatus: false, message: 'Wrong Email or Password' })
            }

            const token = jwt.sign(
                { student: true, email: req.body.email, id: studentId },
                process.env.STUDENT_KEY,
                { expiresIn: '30d' }
            );

            res.status(200).json({ loginStates: true, token: token });

        });

    } catch (err) {
        console.log(err.message)
    }

});

// get grade

router.get('/student-result', async (req, res) => {
    const token = req.header('token');

    if (!token) {
        return res.status(400).json({ status: false, message: 'Token not found!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.STUDENT_KEY);
        const studentId = decoded.id;

        const sql = `
            SELECT
                students.id AS student_id,
                students.name AS student_name,
                students.image,
                students.gender AS student_gender,
                students.email,
                grades.grade AS student_grade,
                classes.class_name,
                subjects.name,
                exams.average,
                exams.assi1,
                exams.assi2,
                exams.midterm,
                exams.final
            FROM 
                students
            LEFT JOIN grades ON students.id = grades.student_id
            LEFT JOIN exams ON students.id = exams.student_id
            LEFT JOIN classes ON students.class_id = classes.id
            LEFT JOIN subjects ON grades.subject_id = subjects.id
            WHERE students.id = ?
        `;

        connection.query(sql, [studentId], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, error: 'Database query error' });
            }

            return res.status(200).json({ status: true, student: result });
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ status: false, error: 'Invalid token' });
    }
});


module.exports = { student: router }

