const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const bcrypt = require('bcrypt');
const { auth } = require('../middelwer/auth');
const admin = require('./admin');
const { teacher, teachers } = require('../middelwer/teacher');
require('dotenv').config()





const router = express.Router();


router.post('/teacher-login', async (req, res) => {

    const { email, password } = req.body;



    if (!email || !password) {
        return res.status(200).json({ status: false, message: 'Missing required fields' })
    }

    try {

        const sql = 'SELECT * FROM teachers WHERE email=?';
        connection.query(sql, [req.body.email], async (err, result) => {
            if (err) {
                console.error("Database query error:", err.message);
                return res.status(500).json({ loginStatus: false, error: err.message })
            }

            if (result.length == 0) {
                return res.status(200).json({ localStatus: false, message: 'Wrong Email or Password' })

            }
            const teacherId = result[0].id;
            const hashedPassword = result[0].password;

            const isPasswordValid = await bcrypt.compare(password, hashedPassword);

            if (!isPasswordValid) {
                return res.status(200).json({ loginStatus: false, message: 'Wrong Email or Password' })
            }

            const token = jwt.sign(
                { teacher: true, email: req.body.email, id: teacherId },
                process.env.TEACHER_KEY,
                { expiresIn: '30d' }
            );

            res.status(200).json({ loginStates: true, token: token });

        });

    } catch (err) {
        console.log(err.message)
    }

});

//add attendance 

router.post('/take-attendance', async (req, res) => {
    const sql = `INSERT INTO attendance (student_id,class_id) VALUES(?)`;

    const values = [
        req.body.student_id,
        req.body.class_id,
    ]

    try {
        connection.query(sql, [values], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ state: true, result })
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: err.message })
    }


})

// add grades

router.post('/add-grade', async (req, res) => {
    const sql = `INSERT INTO grades (student_id,subject_id,grade) VALUES(?)`;

    const values = [
        req.body.student_id,
        req.body.subject_id,
        req.body.grade
    ]

    try {
        connection.query(sql, [values], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ state: true, result })
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: err.message })
    }
})

// get attendance

router.get('/get-attendance', async (req, res) => {
    const sql = 'SELECT * FROM attendance'

    try {
        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: err.message })
    }
})

// get greade

router.get('/get-grade', async (req, res) => {
    const sql = 'SELECT * FROM grades'

    try {

        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: err.message })
    }
})

// get teachers 

router.get('/teacher-data', async (req, res) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TEACHER_KEY);
        const teacherId = decoded.id;

        const teacherQuery = `
            SELECT class_id, subject_id 
            FROM teachers 
            WHERE id = ?`;

        connection.query(teacherQuery, [teacherId], (err, teacherResult) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, error: err.message });
            }

            if (teacherResult.length === 0) {
                return res.status(404).json({ status: false, message: 'Teacher not found' });
            }

            const { class_id, subject_id } = teacherResult[0];

            // Query to get students in the teacher's class along with class details
            const studentQuery = `
                SELECT 
                    students.id, 
                    students.name, 
                    students.email, 
                    students.dob, 
                    students.gender, 
                    students.address, 
                    classes.class_name 
                FROM 
                    students 
                JOIN 
                    classes 
                ON 
                    students.class_id = classes.id
                WHERE 
                    students.class_id = ?`;

            connection.query(studentQuery, [class_id], (err, studentResult) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ status: false, error: err.message });
                }

                // Query to get the teacher's subject details
                const subjectQuery = `
                    SELECT id, name, description 
                    FROM subjects 
                    WHERE id = ?`;

                connection.query(subjectQuery, [subject_id], (err, subjectResult) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ status: false, error: err.message });
                    }

                    return res.status(200).json({
                        status: true,
                        class_students: studentResult,
                        subject_details: subjectResult,
                    });
                });
            });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ status: false, message: 'Invalid or expired token' });
    }
});







module.exports = { teacher: router };