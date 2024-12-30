const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
require('dotenv').config()





const router = express.Router();


router.post('/login', async (req, res) => {
    const sql = 'SELECT * FROM teachers WHERE email=? AND password=?';
    connection.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(400).json({ loginStatus: false, status: false })
        }

        if (result.length > 0) {
            const teacherId = result[0].id;

            const token = jwt.sign(
                { teacher: true, email: req.body.email, id: teacherId },
                process.env.TEACHER_KEY,
                { expiresIn: '30d' }
            );

            res.status(200).json({ token: token, loginStates: true });
        } else {
            console.log("Login failed: Wrong Email or Password");
            return res.json({ loginStates: false, Error: 'Wrong Email or Password' });
        }
    });
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

module.exports = { teacher: router };