const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const bcrypt = require('bcrypt');
const { teacher, teachers } = require('../middelwer/teacher');
const nodemailer = require('nodemailer')
const { format } = require('date-fns');
const multer = require('multer');
const path = require('path');
require('dotenv').config()





const router = express.Router();

router.post('/vlidate', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        jwt.verify(token, process.env.TEACHER_KEY);
        return res.json({ valid: true });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})


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

router.get('/get-teacher-profile',[teacher , teachers], async (req, res) => {
    const token = req.header('token')

    if (!token) {
        return res.status(400).json({ status: false, message: 'token not found!' })
    }

    try {
        const decoded = jwt.verify(token, process.env.TEACHER_KEY)
        const teacherId = decoded.id

        const sql = `SELECT
            teachers.id,
            teachers.name,
            teachers.email,
            teachers.image,
            subjects.name AS subject_name

            FROM 
                teachers 
            JOIN
                subjects ON teachers.subject_id = subjects.id
            WHERE
                teachers.id = ?    
        `;

        connection.query(sql, [teacherId], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            return res.status(200).json({ status: true, teacher: result[0] })
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({ status: false, message: 'Something went wrong!' })
    }
})

//add attendance 

router.post('/take-attendance',[teacher , teachers], async (req, res) => {

    const { student_id, class_id, status, subject_id } = req.body;

    console.log(subject_id)


    const sql = `
        INSERT INTO attendance (student_id, class_id, status)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE status = ?, updated_at = NOW()
    `;

    const historySql = `INSERT INTO history (student_id, class_id, subject_id,  status) VALUES (?, ?, ? ,?)`;


    try {

        connection.query(historySql, [student_id, class_id, subject_id, status], (err, historyResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to update attendance',
                });
            }

            connection.query(sql, [student_id, class_id, status, status], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        status: false,
                        error: 'Failed to update attendance',
                    });
                }
                return res.status(200).json({
                    status: true,
                    message: 'Attendance updated successfully',
                });
            });

        });


    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({
            status: false,
            error: 'Server error occurred',
        });
    }
});


// get before status

router.get('/before-status/:id',[teacher , teachers], async (req, res) => {
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

router.get('/get-attendance',[teacher , teachers], async (req, res) => {

    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TEACHER_KEY);
        const teacherId = decoded.id;

        const sql = `
            SELECT 
                students.id AS student_id,
                students.name AS student_name,
                students.gender AS student_gender,
                classes.id AS class_id,
                classes.class_name,
                attendance.id AS attendance_id,
                attendance.status AS attendance_status,
                attendance.attendance_date,
                subjects.id AS subject_id
            FROM 
                students
            INNER JOIN 
                classes ON students.class_id = classes.id
            INNER JOIN 
                teachers ON classes.id = teachers.class_id
            INNER JOIN
                subjects ON subjects.id = teachers.subject_id
            LEFT JOIN 
                attendance ON students.id = attendance.student_id
            WHERE 
                teachers.id = ?`;

        connection.query(sql, [teacherId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: false, error: err.message });
            }

            return res.status(200).json({ status: true, attendance: result });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: err.message });
    }
});


// get greade

router.get('/get-grade',[teacher , teachers], async (req, res) => {

    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.TEACHER_KEY);
    const teacherId = decoded.id;

    try {
        const sql = `SELECT 
            grades.grade AS grade,
            subjects.name AS subject_name,
            students.id AS student_id,
            students.name AS student_name,
            students.gender AS gender,
            classes.class_name AS class_name
        FROM
            grades
        LEFT JOIN 
            students ON grades.student_id = students.id
        LEFT JOIN 
            subjects ON grades.subject_id = subjects.id
        LEFT JOIN 
            teachers ON teachers.subject_id = subjects.id AND teachers.class_id = students.class_id
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
        return res.status(400).json({ status: false, error: "server error!" })
    }
})

// get one grade

router.get('/get-student-grade/:id',[teacher , teachers], (req, res) => {
    const id = req.params.id;
    console.log(id)

    const sql = `SELECT
            exams.average
        FROM
            exams
        WHERE
            student_id = ?`
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ status: false, error: err.message });
        }

        return res.status(200).json({ status: true, result: result[0] });
    });
});


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
            SELECT 
            class_id, 
            subject_id 
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


            const studentQuery = `
                SELECT 
                    students.id, 
                    students.name, 
                    students.email, 
                    students.dob, 
                    students.gender, 
                    students.address, 
                    classes.class_name,
                    classes.id AS class_id,
                    exams.average,
                    grades.grade
                FROM 
                    students
                JOIN 
                    classes  ON students.class_id = classes.id 
                LEFT JOIN 
                    exams ON students.id = exams.student_id AND classes.id = exams.class_id
                LEFT JOIN   
                    grades ON students.id  = grades.student_id
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
        return res.status(400).json({ status: false, error: "server error!" })
    }
})

// edit teacher profile


router.put('/edit-teacher/:id',[teacher , teachers], upload.single('image'), async (req, res) => {

    const id = req.params.id;
    const { password } = req.body;

    try {

        const image = req.file ? req.file.filename : null;


        const sql = `UPDATE  teachers  SET password = ? , image = ?  WHERE id = ?`

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({ status: false, error: 'hash error' })
            }

            const values = [hash, image, id];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ status: false, error: err.message })
                }
                return res.status(200).json({ status: true, message: 'Teacher Update successfully!' })
            })
        })

    } catch (err) {
        console.log(err.message)
        return res.status(400).json({ status: false, error: "server error!" })
    }
})


// get assistance

router.get('/get-assistence',[teacher , teachers], async (req, res) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TEACHER_KEY);
        const teacherId = decoded.id;

        const sql = `
            SELECT 
                students.id AS student_id,
                students.name AS student_name,
                students.gender AS student_gender,
                teachers.id AS teacher_id,
                teachers.name AS teacher_name,
                subjects.name AS teacher_subject,
                subjects.id AS subject_id,
                classes.id AS class_id,
                exams.assi1,
                exams.assi2,
                exams.midterm,
                exams.final,
                exams.average
            FROM 
                students
            INNER JOIN   -- INNER JOIN means match the student table based on classes.id
                classes ON students.class_id = classes.id 
            INNER JOIN 
                teachers ON teachers.class_id = classes.id
            INNER JOIN 
                subjects ON teachers.subject_id = subjects.id
            LEFT JOIN 
                exams ON exams.student_id = students.id AND exams.teacher_id = teachers.id AND exams.class_id = classes.id 
            WHERE
                teachers.id = ?;
        `;

        connection.query(sql, [teacherId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: false, error: err.message });
            }

            return res.status(200).json({ status: true, students: result });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: "server error!" })
    }
});

// add assisstence

router.post('/add-assistence/:id',[teacher , teachers], async (req, res) => {

    const student_id = req.params.id;


    const { teacher_id, class_id, subject_id, assi1, assi2, midterm, final } = req.body;

    try {

        const checkExistQuery = 'SELECT * FROM exams WHERE student_id = ? AND subject_id = ?';

        connection.query(checkExistQuery, [student_id, subject_id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, error: 'Query error while checking existence' });
            }

            if (result.length > 0) {
                // Update the existing row with new values

                // IF(condition, value_if_true, value_if_false)
                // assi1 = IF(? IS NOT NULL, ?, assi1)

                const updateQuery = `
                    UPDATE exams 
                    SET 
                        assi1 = IF(? IS NOT NULL, ?, assi1), 
                        assi2 = IF(? IS NOT NULL, ?, assi2),
                        midterm = IF(? IS NOT NULL, ?, midterm),
                        final = IF(? IS NOT NULL, ?, final)
                    WHERE student_id = ? AND subject_id = ?
                `;

                const updateValues = [
                    assi1, assi1,
                    assi2, assi2,
                    midterm, midterm,
                    final, final,
                    student_id, subject_id
                ];

                connection.query(updateQuery, updateValues, (err, updateResult) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ status: false, error: 'Query error while updating data' });
                    }
                    return res.status(200).json({ status: true, message: 'Record updated successfully!' });
                });
            } else {
                // Insert a new row if it doesn't exist
                const insertQuery = `
                    INSERT INTO exams 
                    (teacher_id, student_id, class_id, subject_id, assi1, assi2, midterm, final) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const insertValues = [teacher_id, student_id, class_id, subject_id, assi1 || 0, assi2 || 0, midterm || 0, final || 0];

                connection.query(insertQuery, insertValues, (err, insertResult) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ status: false, error: 'Query error while inserting data' });
                    }
                    return res.status(200).json({ status: true, message: 'Record added successfully!' });
                });
            }
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: "server error!" })
    }
});


// get assistance 

router.get('/get-assistance/:id',[teacher , teachers], (req, res) => {
    const id = req.params.id;
    console.log(id)

    const sql = 'SELECT * FROM exams WHERE student_id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ status: false, error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ status: false, error: 'No exam found for the given ID.' });
        }
        return res.status(200).json({ status: true, result: result[0] });
    });
});



// get total

router.get('/get-total',[teacher , teachers], async (req, res) => {

    const student_id = req.body.student_id

    try {
        const sql = 'SELECT average FROM exams WHERE student_id = ?'

        connection.query(sql, [student_id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, result });
        })
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: "server error!" })
    }

})

// delete message

router.delete('/message-delete/:id',[teacher , teachers], async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    const sql = 'DELETE FROM messages WHERE id = ?'

    try {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'message deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: err.message })
    }
})

// get history

router.get('/get-history', async (req, res) => {

    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TEACHER_KEY);
        const teacherId = decoded.id;

        const sql = `
                    SELECT 
                students.id AS student_id,
                students.name AS student_name,
                classes.id AS class_id,
                subjects.id AS subject_id,
                subjects.name AS subject_name,
                subjects.id,
                history.attendance_date,
                COUNT(CASE WHEN history.status = 'Absent' THEN 1 END) AS absent_count
            FROM
                history
            INNER JOIN
                classes ON history.class_id = classes.id
            INNER JOIN
                teachers ON classes.id = teachers.class_id AND history.subject_id = teachers.subject_id
            INNER JOIN
                students ON students.id = history.student_id
            INNER JOIN 
                subjects ON history.subject_id = subjects.id
            WHERE
                teachers.id = ?
            GROUP BY
                students.id, students.name, classes.id, subjects.id, subjects.name, history.attendance_date
            ORDER BY
                history.attendance_date DESC, students.name;
            `;

        connection.query(sql, [teacherId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: false, error: err.message });
            }

            return res.status(200).json({ status: true, history: result });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: "server error!" })
    }
});


// get student in teacher section

router.get('/counter-number-student', async (req, res) => {
    const token = req.header('token')

    if (!token) {
        return res.status(400).send('token not provide')
    }
    try {

        const decoded = jwt.verify(token, process.env.TEACHER_KEY)
        const teacherId = decoded.id

        const sql = `
            SELECT 
                COUNT(DISTINCT students.id) AS student_count, -- Total students in the teacher's class and subject
                SUM(CASE WHEN history.status = 'Present' THEN 1 ELSE 0 END) AS present_day, -- Total "Present" days for this subject
                COUNT(history.id) AS history_id, -- Total attendance records for this subject
                SUM(exams.average) AS grade_average, -- Average grade in this subject
                COUNT(exams.id) AS total_grade -- Total number of exams in this subject
            FROM
                students
            JOIN
                teachers ON teachers.class_id = students.class_id
            LEFT JOIN 
                exams ON exams.student_id = students.id AND exams.subject_id = teachers.subject_id -- Filter exams by teacher's subject
            LEFT JOIN
                history ON history.student_id = students.id AND history.subject_id = teachers.subject_id 
            WHERE
                teachers.id = ?;
            `;

        connection.query(sql, [teacherId], (err, result) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({ status: false, message: 'query error!' })
            }
            return res.status(200).json({ status: true, result })
        })

    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: "server error!" })
    }
})


// forgot password

router.post('/check-email', async (req, res) => {
    const email = req.body.email;

    try {
        const sql = 'SELECT * FROM teachers WHERE email = ?';

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
            SELECT * FROM forgottable 
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

    const sql = `UPDATE teachers SET password = ? WHERE email = ?`;

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









module.exports = { teacher: router };