const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const { student, students } = require('../middelwer/student');
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

router.get('/student-result',[student , students], async (req, res) => {
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


// edit student profile

router.put('/edit-student/:id',[student , students],  async (req, res) => {
    const id = req.params.id

    const { password } = req.body

    try {
        bcrypt.hash(password , (10) , (err , hash) => {
            if(err) {
                console.log(err.message)
                return res.status(500).json({status:false , Error : 'hash error'})
            }
            const sql = `UPDATE students SET password = ? WHERE id = ?`;
        connection.query(sql, [hash, id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            return res.status(200).json({ status: true, message: 'grade updated' })
        })
        })
        

    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// forgot password

router.post('/check-email', async (req, res) => {
    const email = req.body.email;

    try {
        const sql = 'SELECT * FROM students WHERE email = ?';

        connection.query(sql, [email], async (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, message: 'Query error!' });
            }

            if (result.length > 0) {
                // Generate a random 6-digit verification code
                const verificationCode = Math.floor(100000 + Math.random() * 900000);
                const expiresAt = new Date(Date.now() + 3600000); // Expires in 1 hour

                const insertSql = `
                    INSERT INTO forgottable (email, token, expires_at, is_used)
                    VALUES (?, ?, ?, ?)
                `;

                connection.query(insertSql, [email, verificationCode, expiresAt, false], (insertErr) => {
                    if (insertErr) {
                        console.error(insertErr.message);
                        return res.status(500).json({ status: false, message: 'Failed to save verification code!' });
                    }

                    // Send the verification code via email
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        service: 'Gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'Password Reset Verification Code',
                        text: `Your verification code is: ${verificationCode}`,
                        html: `<p>Your verification code is:</p><h3>${verificationCode}</h3>`
                    };

                    transporter.sendMail(mailOptions, (mailErr, info) => {
                        if (mailErr) {
                            console.error(mailErr.message);
                            return res.status(500).json({ status: false, message: 'Failed to send email!' });
                        }

                        return res.status(200).json({
                            status: true,
                            message: 'Verification code sent to your email address.'
                        });
                    });
                });
            } else {
                return res.status(200).json({ status: false, message: 'Account not found!' });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});


// chek the token

router.post('/verify-code', async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const sql = `
            SELECT * FROM forgotTable 
            WHERE email = ? AND token = ? AND expires_at > NOW() AND is_used = FALSE
        `;

        connection.query(sql, [email, verificationCode], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, message: 'Query error!' });
            }

            if (result.length > 0) {
                // Mark the code as used
                const updateSql = `UPDATE forgottable SET is_used = TRUE WHERE email = ? AND token = ?`;
                connection.query(updateSql, [email, verificationCode]);

                return res.status(200).json({ status: true, message: 'Verification successful!' });
            } else {
                return res.status(200).json({ status: false, message: 'Invalid or expired verification code!' });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});


// reset-password
router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ status: false, message: 'Email and new password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: false, message: 'Invalid email format.' });
    }

    const sql = `UPDATE students SET password = ? WHERE email = ?`;

    try {
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
                console.error('Hashing error:', err.message);
                return res.status(500).json({ status: false, message: 'Failed to hash password.' });
            }

            connection.query(sql, [hash, email], (err, result) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json({ status: false, message: 'Database query failed.' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ status: false, message: 'Email not found.' });
                }

                return res.status(200).json({ status: true, message: 'Password reset successfully!' });
            });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        return res.status(500).json({ status: false, message: 'Server error!' });
    }
});


module.exports = { student: router }

