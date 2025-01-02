const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const bcrypt = require('bcrypt');
const { teacher, teachers } = require('../middelwer/teacher');
const cron = require('node-cron');
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

// get teacher profile

router.get('/get-teacher-profile', async(req , res) => {
    const token = req.header('token')

    if(!token) {
        return res.status(400).json({status:false , message :'token not found!'})
    }

    try {
        const decoded = jwt.verify(token , process.env.TEACHER_KEY )
        const teacherId = decoded.id

        const sql = 'SELECT * FROM teachers WHERE id = ?'

        connection.query(sql , [teacherId] , (err , result) => {
            if(err) {
                console.error(err.message)
                return res.status(500).json({status:false , error:'query error'})
            }

            return res.status(200).json({status:true , result})
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({status:false , message :'Something went wrong!'})
    }
})

//add attendance 

router.post('/take-attendance', async (req, res) => {

    const { student_id, class_id, status } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    const sql = `INSERT INTO attendance (student_id, class_id, status, attendance_date)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE status = ?`;

    try {
        connection.query(
            sql,
            [student_id, class_id, status, today, status],
            (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ status: false, error: 'Query error' });
                }
                return res.status(200).json({ status: true, message: 'Attendance updated.' });
            }
        );
    } catch (err) {
        console.error(err);
        return res.status(400).json({ status: false, error: "Something went wrong!" });
    }
});


// Scheduled Task: Reset attendance daily at midnight
cron.schedule('0 0 * * *', () => {
    const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const resetSql = `
        INSERT INTO attendance (student_id, class_id, status, attendance_date)
        SELECT s.id AS student_id, c.id AS class_id, '-' AS status, ? AS attendance_date
        FROM students s
        CROSS JOIN classes c
        WHERE NOT EXISTS (
                SELECT 1 FROM attendance
                WHERE attendance.student_id = s.id
                AND attendance.class_id = c.id
                AND attendance.attendance_date = ?
        )
    `;

    connection.query(resetSql, [today, today], (err, result) => {
        if (err) {
            console.error('Error resetting attendance:', err.message);
        } else {
            console.log('Daily attendance reset successfully.');
        }
    });
});


// update attendance

router.put('/edit-attendance/:id', async (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    try {
        const sql = `UPDATE attendance SET status = ? WHERE id = ?`;

        connection.query(sql, [status, id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, message: 'Attendance record not found' })
            }
            return res.status(200).json({ status: true, message: 'Attendance updated successfully' })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'Something went wrong!' })
    }
})

// get before status

router.get('/before-status/:id', async (req, res) => {
    const id = req.params.id

    try {
        const sql = 'SELECT * FROM attendance WHERE id = ?'

        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, message: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })


    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'somtting wrong!' })
    }
})

// add grades

router.post('/add-grade', [teacher, teachers], async (req, res) => {

    try {

        const chekExist = 'SELECT id FROM grades WHERE subject_id = ? AND student_id = ?'
        connection.query(chekExist, [req.body.subject_id, req.body.student_id], (err, result) => {

            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: err.message })
            }

            if (result.length > 0) {
                return res.status(200).json({ status: false, message: 'Student in This Subject Already Exist' })
            }

            const values = [
                req.body.student_id,
                req.body.subject_id,
                req.body.grade
            ]
            const sql = `INSERT INTO grades (student_id,subject_id,grade) VALUES(?)`;
            connection.query(sql, [values], (err, result) => {
                if (err) {
                    throw err
                }
                return res.status(200).json({ status: true, message: 'Grade Added!' })
            })

        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: "server error!" })
    }
})

// get attendance

// router.get('/get-attendance', async (req, res) => {

//     const token = req.header('token');
//     if (!token) {
//         return res.status(401).json({ status: false, message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.TEACHER_KEY);
//     const teacherId = decoded.id;



//     const sql = `SELECT
//             attendance.id AS attendance_id,
//             attendance.status AS attendance_status,
//             students.name AS student_name,
//             students.gender AS student_gender,
//             classes.id AS class_id

//         FROM 
//             attendance
//         LEFT JOIN 
//             students ON attendance.student_id = students.id
//         LEFT JOIN
//             classes ON attendance.class_id = classes.id
//         LEFT JOIN
//             teachers ON teachers.class_id = classes.id
//         LEFT JOIN 
//             classes ON teachers.class_id = classes.id
//         WHERE
//             teachers.id = ?`;

//     try {
//         connection.query(sql,[teacherId], (err, result) => {
//             if (err) {
//                 throw err
//             }
//             return res.status(200).json({ status: true, result })
//         })
//     } catch (err) {
//         console.error(err.message)
//         return res.status(400).json({ status: false, error: err.message })
//     }
// })

// get greade

router.get('/get-grade', async (req, res) => {

    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.TEACHER_KEY);
    const teacherId = decoded.id;

    try {
        const sql = `SELECT 
            grades.id AS grade_id,
            students.id AS student_id,
            students.name AS student_name,
            students.gender AS gender,
            grades.grade AS grade,
            subjects.name AS subject_name,
            grades.date AS grade_date,
            attendance.status,
            attendance.id AS attendance_id,
            classes.id AS class_id
        FROM 
            grades
        LEFT JOIN 
            subjects ON grades.subject_id = subjects.id
        LEFT JOIN 
            teachers ON teachers.subject_id = subjects.id
        LEFT JOIN 
            students ON grades.student_id = students.id
        LEFT JOIN 
            attendance ON students.id = attendance.student_id
        LEFT JOIN
            classes ON teachers.class_id = classes.id
        WHERE 
            teachers.id = ?;
        `;

        connection.query(sql, [teacherId], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ status: false, error: err.message })
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

//  get student

router.get('/get-student/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)

    try {
        const sql = 'SELECT * FROM students WHERE id = ?'
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: err.message })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).jsone({ status: false, error: err.message })
    }
})








module.exports = { teacher: router };