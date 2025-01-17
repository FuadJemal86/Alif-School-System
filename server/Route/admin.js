const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../db');
require('dotenv').config();
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const { console } = require('inspector');
const { auth, admin } = require('../middelwer/auth');
const crypto = require('crypto')





const router = express.Router();



router.post('/vlidate', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        jwt.verify(token, process.env.ADMIN_PASSWORD);
        return res.json({ valid: true });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});


// image uplode

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



router.post('/admin-login', async (req, res) => {

    const { email, password } = req.body;



    if (!email || !password) {
        return res.status(200).json({ status: false, message: 'Missing required fields' })
    }

    try {

        const sql = 'SELECT * FROM admin WHERE email = ?';
        connection.query(sql, [req.body.email], async (err, result) => {
            if (err) {
                console.error("Database query error:", err.message);
                return res.status(500).json({ loginStatus: false, error: err.message })
            }

            if (result.length == 0) {
                return res.status(200).json({ localStatus: false, message: 'Wrong Email or Password' })

            }
            const adminId = result[0].id;
            const hashedPassword = result[0].password;

            const isPasswordValid = await bcrypt.compare(password, hashedPassword);

            if (!isPasswordValid) {
                return res.status(200).json({ loginStatus: false, message: 'Wrong Email or Password' })
            }

            const token = jwt.sign(
                { admin: true, email: req.body.email, id: adminId },
                process.env.ADMIN_PASSWORD,
                { expiresIn: '30d' }
            );

            res.status(200).json({ loginStates: true, token: token });

        });

    } catch (err) {
        console.log(err.message)
    }

});

// add admin 

router.post('/add-admin', upload.single('image'), async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(200).json({ status: false, message: 'Missing required fields!' })
    }


    try {

        const image = req.file ? req.file.filename : null;

        bcrypt.hash(password, 10, (err, hash) => {
            const value = [
                name,
                email,
                hash,
                image
            ]

            if (err) {
                return res.status(500).json({ hash: false, error: 'hash error' })
            }

            const isAdminFound = 'SELECT id FROM admin WHERE email = ?'
            connection.query(isAdminFound, [email], (err, result) => {
                if (err) {
                    console.error(err.message)
                    return res.status(500).json({ status: false, error: err.message })
                }
                if (result.length > 0) {
                    return res.status(200).json({ status: false, message: 'Email Already Exist!' })
                }

                const sql = 'INSERT INTO admin (name , email , password , image) VALUES (?)'

                connection.query(sql, [value], (err, result) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ status: false, error: 'query error' })
                    }
                    return res.status(200).json({ status: true, message: 'Admin added successfully!' })
                })
            })

        })


    } catch (err) {
        console.log(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// get admin

router.get('/get-admin', (req, res) => {

    const token = req.header('token')

    if (!token) {
        return res.status(400).send('Access Denied, No token Provided!')
    }

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD)

        const id = decoded.id
        console.log(id)

        const sql = `SELECT 
            name,
            email,
            image
        FROM
            admin
        WHERE    
            id = ?`

        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            if (result.length > 0) {
                return res.status(200).json({ status: true, admin: result[0] })
            } else {
                return res.status(200).json({ status: false, message: 'Admin is not found!' })
            }
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }

})

// edit admin

router.put('/edit-admin/:id', upload.single('image'), async (req, res) => {

    const id = req.params.id;
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields!' })
    }

    try {

        bcrypt.hash(password, (10), (err, hash) => {
            if (err) {
                console.log(err.message)
                return res.status(200).json({ status: false, Error: 'hash error' })
            }


            const image = req.file ? req.file.filename : null;

            const values = [name, hash, image, id];

            const sql = `UPDATE  admin  SET name = ? , password = ? , image = ?  WHERE id = ?`

            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ status: false, error: 'query error' })
                }
                return res.status(200).json({ status: true, message: 'Admin Update successfully!' })
            })

        })

    } catch (err) {
        console.log(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// add subject

router.post('/add-subjects', [auth, admin], async (req, res) => {

    const { name } = req.body


    try {

        const chekSubject = 'SELECT id FROM subjects WHERE name = ?'
        connection.query(chekSubject, [name], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            if (result.length > 0) {
                return res.status(200).json({ status: false, message: 'Subject Already' })
            }

            const sql = `INSERT INTO subjects (name,description) VALUES(?,?)`;
            connection.query(sql, [req.body.name, req.body.description], (err, result) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    return res.status(500).json({
                        status: false,
                        error: 'Failed to fetch teacher data from the database',
                    });
                }
                return res.status(200).json({ status: true, result })
            });
        });

    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }

})

// get subjects

router.get('/get-subject', async (req, res) => {

    try {
        const sql = 'SELECT * FROM subjects'
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// get teacher subjects

router.get('/auth/get-teacher/:id', [auth, admin], (req, res) => {

    const id = req.params.id

    const sql = 'SELECT * FROM subjects WHERE id = ?'

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, error: 'query error' });
        }
        return res.status(200).json({ status: true, result });
    });
});

// subject delete

router.delete('/subject-delete/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    const sql = 'DELETE FROM subjects WHERE id = ?'

    try {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'Subject deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// add techers

router.post('/add-teacher', [auth, admin], upload.single('image'), async (req, res) => {

    const { name, password, subject_id, class_id, email, phone, address } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!name || !password || !subject_id || !class_id || !email || !phone || !address) {
        return res.status(400).json({ status: false, message: 'Missing required fields' })
    }


    try {

        const chekExist = 'SELECT id FROM teachers WHERE email = ? OR (subject_id = ? AND class_id = ?)'

        connection.query(chekExist, [email, subject_id, class_id,], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: err.message })
            }

            if (result.length > 0) {
                return res.status(200).json({ status: false, message: 'Already Exist' })
            }


            bcrypt.hash(password, 10, (err, hash) => {

                const value = [name, hash, subject_id, class_id, email, image, phone, address]

                if (err) {
                    return res.status(500).json({ hash: false, error: err.message })
                }

                const sql = `INSERT INTO teachers (name,password,subject_id,class_id, email,image, phone, address) VALUES (?,?, ?, ?, ?, ?,?,?)`;
                connection.query(sql, value, (err, result) => {
                    if (err) {
                        console.error(err.message)
                        return res.status(400).json({ status: false, error: err })
                    }
                    return res.status(200).json({ status: true, message: 'sucsess' })
                })
            })
        })



    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }

});

// get teacher

router.get('/get-teacher', [auth, admin], async (req, res) => {
    const sql = `
                SELECT 
            teachers.id, 
            teachers.name, 
            teachers.email, 
            teachers.phone, 
            teachers.address, 
            teachers.subject_id,
            teachers.class_id,
            subjects.name AS subject_name,
            classes.class_name
        FROM 
            teachers
        LEFT JOIN 
            subjects 
        ON 
            teachers.subject_id = subjects.id

        LEFT JOIN
            classes

        ON 
            teachers.class_id = classes.id;

            `;

    try {
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, result });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: 'server error' });
    }
});


// get teacher name

router.get('/get-teacher-name', [auth, admin], async (req, res) => {

    try {
        const sql = 'SELECT * FROM teachers'
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, result })
        })

    } catch (err) {
        return res.status(400).json({ status: false, error: 'query error' })
    }
})

// delete the teacher

router.delete('/teacher-delete/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    try {
        const sql = 'DELETE FROM teachers WHERE id = ?'

        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'Subject deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// edit the teacher

router.put('/update-teacher/:id', [auth, admin], async (req, res) => {
    const id = req.params.id
    console.log('id:', id)
    const { name, subject_id, email, phone, address } = req.body;
    try {
        const sql = `
        UPDATE teachers 
        SET name = ?, subject_id = ?, email = ?, phone = ?, address = ? 
        WHERE id = ?
    `;

        connection.query(sql, [name, subject_id, email, phone, address, id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'teacher update successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }

})

// show selected id teacher info

router.get('/get-teacher/:id', [auth, admin], async (req, res) => {
    const id = req.params.id

    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: false,
            error: 'Invalid ID provided',
        });
    }

    try {
        const sql = 'SELECT * FROM teachers WHERE id = ?'

        connection.query(sql, [id], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })


    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})



// send email to teacher

router.post('/send-email', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email) {
        return res.json({ Status: false, Message: 'Full information is required' });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: 'Alif School <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Welcome to Alif School!',
        text: `
            Hi ${name},

            Welcome to our platform! Your account has been successfully created.
            Here are your credentials:
            - Email: ${email}
            - Password: ${password}

            Please log in and update your password as soon as possible.

            Best regards,
            Admin Team
        `,
        html: `
            <h2>Hi ${name},</h2>
            <p>Welcome to our platform! Your account has been successfully created.</p>
            <p><strong>Here are your credentials:</strong></p>
            <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please log in and update your password as soon as possible.</p>
            <br/>
            <p>Best regards,<br/>Admin Team</p>
        `,
    };

    try {
        await transporter.sendMail(message);
        res.json({ Status: true, Message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.json({ Status: false, Error: 'server error' });
    }
});


// add class

router.post('/add-class', [auth, admin], async (req, res) => {

    const { class_name } = req.body

    try {
        const classChek = 'SELECT id FROM classes WHERE class_name = ?'

        connection.query(classChek, [class_name], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            if (result.length > 0) {
                return res.status(200).json({ status: false, message: 'class already exist' })
            }

            const sql = `INSERT INTO classes (class_name) VALUES(?)`;
            connection.query(sql, [req.body.class_name], (err, result) => {
                if (err) {
                    throw err
                }
                return res.status(200).json({ status: true, message: 'Class Added! ' })
            })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ state: true, error: 'server error' })
    }

})

// get class for option 

router.get('/get-class-section', [auth, admin], async (req, res) => {

    try {
        const sql = 'SELECT * FROM classes'

        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// get class

router.get('/get-class', [auth, admin], async (req, res) => {
    const sql = 'SELECT * FROM classes'

    try {
        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// delete class

router.delete('/class-delete/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    const sql = 'DELETE FROM classes WHERE id = ?'

    try {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'Subject deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})


// add student

router.post('/add-student', [auth, admin], upload.single('image'), async (req, res) => {
    const email = req.body.email;

    try {
        const checkEmailSql = 'SELECT id FROM students WHERE email = ?';

        connection.query(checkEmailSql, [email], (err, result) => {
            if (err) {
                console.error(err.message, 'SQL error');
                return res.status(500).json({ status: false, error: err.message });
            }

            if (result.length > 0) {
                return res.status(400).json({ status: false, error: 'The email already exists' });
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.error('Hashing error:', err.message);
                    return res.status(500).send('Hashing error');
                }

                // Handle optional image
                const image = req.file ? req.file.filename : null;

                const values = [
                    req.body.dip_id,
                    req.body.name,
                    hash,
                    req.body.email,
                    image, // Use the image value (null if not provided)
                    req.body.dob,
                    req.body.gender,
                    req.body.class_id,
                    req.body.address
                ];

                const sql = `INSERT INTO students (dip_id,name, password, email, image, dob, gender, class_id, address) VALUES(?)`;

                connection.query(sql, [values], (err, result) => {
                    if (err) {
                        console.error('Database query error:', err.message);
                        return res.status(500).json({
                            status: false,
                            error: 'query error',
                        });
                    }
                    return res.status(200).json({ status: true, message: 'Successfully added' });
                });
            });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: 'server error' });
    }
});


// get student

router.get('/get-student', [auth, admin], async (req, res) => {
    const sql = `
    SELECT 
    
    students.id,
    students.name,
    students.email,
    students.address,
    students.dob,
    students.gender,
    dip.dip_name,
    classes.class_name

    FROM students

    LEFT JOIN classes
    ON
    students.class_id = classes.id

    LEFT JOIN dip
    ON  students.dip_id = dip.id
    `;

    try {
        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// delete student

router.delete('/delete-student/:id', [auth, admin], async (req, res) => {

    const id = req.params.id

    try {
        const sql = 'DELETE FROM students WHERE id = ?'
        connection.query(sql, [id], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }

})

//  edit(update student)

router.put('/update-student/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    const { name, email, class_name, gender, dob, address } = req.body;


    if (!name || !email || !class_name || !gender || !dob || !address) {
        return res.status(400).json({ status: false, error: 'All fields are required' });
    }

    try {
        const sql = `
            UPDATE students
            SET name = ?, email = ?, class_id = ?, gender = ?, dob = ?, address = ?
            WHERE id = ?
        `;
        connection.query(sql, [name, email, class_name, gender, dob, address, id], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, error: 'Query error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: false, error: 'Student not found' });
            }

            return res.status(200).json({ status: true, message: 'Student updated successfully!' });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ status: false, error: 'Server error!' });
    }
});



// select student by id

router.get('/get-student/:id', [auth, admin], async (req, res) => {
    const id = req.params.id
    console.log(id)

    try {
        const sql = 'SELECT * FROM students WHERE id = ?'
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).jsone({ status: false, error: 'server error' })
    }
})

// get student for parents

router.get('/get-students/:id', [auth, admin], async (req, res) => {
    const id = req.params.id
    console.log(id)

    try {
        const sql = 'SELECT * FROM students WHERE id = ?'
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).jsone({ status: false, error: 'server error' })
    }
})

// send email to student

router.post('/send-email-student', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email) {
        return res.json({ Status: false, Message: 'Email is required' });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'fuad47722@gmail.com',
            pass: 'adyu juwc wdvb ukhf',
        },
    });

    const message = {
        from: 'Alif School <fuad47722@gmail.com>',
        to: email,
        text: `
            Hi ${name},

            Welcome to our Alif School! Your account has been successfully created.
            Here are your credentials:
            - Email: ${email}
            - Password: ${password}

            Please log in and update your password as soon as possible.

            Best regards,
            Admin Team
        `,
    };

    try {
        await transporter.sendMail(message);
        res.json({ Status: true, Message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.json({ Status: false, Error: 'server error' });
    }
});


// add grades

router.post('/add-grade', [auth, admin], async (req, res) => {

    const { student_id, subject_id, grade } = req.body
    if (!student_id || !subject_id || !grade) {
        return res.status(200).json({ status: false, message: "Missing required fields" });
    }



    const values = [
        req.body.student_id,
        req.body.subject_id,
        req.body.grade
    ]

    try {

        const chekGrade = 'SELECT id FROM grades WHERE subject_id = ?  AND  student_id= ? '
        connection.query(chekGrade, [subject_id, student_id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, message: 'query error' })
            }
            if (result.length > 0) {
                return res.status(200).json({ status: false, message: 'Student in This Subject Already Exists ' })
            }

            const sql = `INSERT INTO grades (student_id,subject_id,grade) VALUES(?)`;
            connection.query(sql, [values], (err, result) => {
                if (err) {
                    console.error(err.message)
                    return res.status(500).json({ status: false, message: 'query error' })
                }
                return res.status(200).json({ status: true, message: 'Grade added successfully!' })
            })
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, message: 'server error' })
    }
})

// get grade

router.get('/get-grade', [auth, admin], async (req, res) => {
    const sql = `SELECT 
        grades.id,
        grades.grade,
        grades.student_id,
        students.name AS student_name,
        subjects.name AS subject_name,
        students.gender,
        students.email
    FROM grades
    LEFT JOIN students 
        ON grades.student_id = students.id
    LEFT JOIN subjects 
        ON grades.subject_id = subjects.id;

            `;

    try {
        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error!' })
    }
})

// update grade

router.put('/edit-grade/:id', [auth, admin], async (req, res) => {
    const id = req.params.id

    const { subject_id, grade } = req.body

    try {
        const sql = `UPDATE grades SET subject_id = ?, grade = ? WHERE id = ?`;
        connection.query(sql, [subject_id, grade, id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            return res.status(200).json({ status: true, message: 'grade updated' })
        })

    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error!' })
    }
})

// delete grade 

router.delete('/delete-grade/:id', [auth, admin], async (req, res) => {
    const id = req.params.id

    try {
        const sql = 'DELETE FROM grades WHERE id = ?'

        connection.query(sql, [id], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, message: 'succsesfuly delete!' })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// add parent 

router.post('/add-parent', [auth, admin], async (req, res) => {

    try {
        const { name, contact, student_id } = req.body;
        if (!name || !contact || !student_id) {
            return res.status(400).json({ status: false, error: "Missing required fields" });
        }

        const values = [name, contact, student_id];

        const isParentFoun = 'SELECT id FROM parents WHERE student_id = ?'

        connection.query(isParentFoun, [student_id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            if (result.length > 0) {
                return res.status(200).json({ status: false, error: 'Parent Already Exist' })
            }

            const sql = `INSERT INTO parents (name,contact,student_id) VALUES(?)`;
            connection.query(sql, [values], (err, result) => {
                if (err) {
                    console.error(err.message)
                    return res.status(500).json({ status: false, error: 'query error' })
                }
                return res.status(200).json({ status: true, message: 'parent added' })
            })
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// get parent info
router.get('/get-parent', [auth, admin], async (req, res) => {
    const sql = `SELECT 

    parents.id,
    parents.name,
    students.name AS student_name,
    students.gender

    FROM parents LEFT JOIN 
    students
    ON parents.student_id = students.id
    `;

    try {
        connection.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})


// update parent

router.put('/edit-parent/:id', [auth, admin], async (req, res) => {

    const id = req.params.id

    const { name } = req.body

    try {
        const sql = 'UPDATE  parents SET  name = ?  WHERE id = ? '
        connection.query(sql, [name], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, message: 'update succsefully' })
        })
    } catch (err) {
        console.error(err.message)
    }

})

// delete parent

router.delete('/delete-parent/:id', [auth, admin], async (req, res) => {
    const id = req.params.id

    try {
        const sql = 'DELETE FROM parents WHERE id = ?'

        connection.query(sql, [id], (err, result) => {
            if (err) {
                throw err
            }
            return res.status(200).json({ status: true, message: 'succsesfuly delete!' })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})


// post contact messgae

router.post('/contact-message', async (req, res) => {

    const { name, email, message } = req.body

    const value = [
        name,
        email,
        message
    ]

    if (!name || !email || !message) {
        return res.status(200).json({ status: false, message: 'Missing required fields' })
    }

    try {

        const sql = `INSERT INTO contact (name , email , message) VALUES(?)`

        connection.query(sql, [value], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, message: 'Send Succsesfuly!' })
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// delete message

router.delete('/delete-message/:id', [auth, admin], async (req, res) => {

    const id = req.params.id
    console.log(id)

    try {
        const sql = 'DELETE FROM contact WHERE id = ?'

        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, message: 'message delete' })
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }

})

// get notification

router.get('/get-messaga', [auth, admin], async (req, res) => {

    try {
        const sql = 'SELECT * FROM contact'

        connection.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }

})

// count messag 

router.get('/count-message', [auth, admin], (req, res) => {
    try {
        const sql = 'SELECT COUNT(id) AS messags FROM contact'

        connection.query(sql, (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }

            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

//  total teacher

router.get('/teacher-total', [auth, admin], (req, res) => {
    try {
        const sql = 'SELECT COUNT(id) AS teacherTotal FROM teachers';

        connection.query(sql, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, message: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: true, error: 'server error' })
    }
})

// total dipartment

router.get('/dip-total', [auth, admin], (req, res) => {
    try {
        const sql = 'SELECT COUNT(id) AS dipTotal FROM dip';

        connection.query(sql, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, message: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: true, error: 'server error' })
    }
})

//  total student

router.get('/student-total', [auth, admin], (req, res) => {
    try {
        const sql = 'SELECT COUNT(id) AS studentTotal FROM students';

        connection.query(sql, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: true, error: 'server error' })
    }
})

// add dipartment

router.post('/add-dipa', [auth, admin], async (req, res) => {

    const { name } = req.body

    if (!name) {
        return res.status(401).json({ status: false, error: 'Missing required fields' })
    }

    try {

        const chekExist = 'SELECT id FROM dip WHERE dip_name = ?'

        connection.query(chekExist, [name], (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: err.message })
            }
            if (result.length > 0) {
                return res.status(200).json({ status: false, message: 'Dipartment Already Exists' })
            }
            const value = [name]
            const sql = 'INSERT INTO dip (dip_name) VALUES(?)'

            connection.query(sql, value, (err, result) => {
                if (err) {
                    console.error(err.message)
                    return res.status(500).json({ status: false, error: err.message })
                }
                return res.status(200).json({ status: true, message: 'Added Succsesfuly!' })
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: true, error: 'server error!' })
    }
})


// get dip

router.get('/get-dip', [auth, admin], (req, res) => {
    try {
        const sql = 'SELECT * FROM dip';

        connection.query(sql, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, error: 'query' })
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: true, error: 'server error' })
    }
})

// delete dip

router.delete('/dip-delete/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    const sql = 'DELETE FROM dip WHERE id = ?'

    try {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch dip data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'dipartment deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})


// sitting image uplode

router.post('/school-image', [auth, admin], upload.single('image'), async (req, res) => {

    const { description } = req.body

    try {
        const image = req.file ? req.file.filename : null;

        const value = [image, description]

        const sql = 'INSERT INTO schoolimags (image,discription) VALUES(?,?)'

        connection.query(sql, value, (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, message: 'Image uploaded successfully' })
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'An error occurred during the operation' });
    }
})

// teacher image

router.post('/teacher-image', [auth, admin], upload.single('image'), async (req, res) => {

    const { name, description } = req.body

    try {
        const image = req.file ? req.file.filename : null;

        const value = [name, description, image];

        const sql = 'INSERT INTO teacherinfo (name,discription,image) VALUES(?,?,?)'

        connection.query(sql, value, (err, result) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ status: false, error: 'query error' })
            }
            return res.status(200).json({ status: true, message: 'Image uploaded successfully' })
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'An error occurred during the operation' });
    }
})

// get school image

router.get('/get-schoolImage', async (req, res) => {

    try {
        const sql = 'SELECT * FROM schoolimags'

        connection.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'query error' });
            }
            return res.status(200).json({ status: true, result });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'An error occurred during the operation' });
    }
});

// get teacher image

router.get('/get-teacherImage', async (req, res) => {

    try {
        const sql = 'SELECT * FROM teacherInfo'

        connection.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, error: 'query error' });
            }
            return res.status(200).json({ status: true, result });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'An error occurred during the operation' });
    }
});

// school image delete 

router.delete('/delete-school-image/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    console.log(id)

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    const sql = 'DELETE FROM schoolimags WHERE id = ?'

    try {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch data data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'data deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

// teacher image(info) delete

router.delete('/delete-teacher-info/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    console.log(id)

    if (!id) {
        return res.status(400).json({ status: false, error: 'ID is required' });
    }

    const sql = 'DELETE FROM teacherinfo WHERE id = ?'

    try {
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch data data from the database',
                });
            }
            return res.status(200).json({ status: true, message: 'data deleted successfully' })

        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error' })
    }
})

//  send message

router.post('/send-message', async (req, res) => {
    const token = req.header('token')

    if (!token) {
        return res.status(400).send('token not provide')
    }

    const message = req.body.message
    const time = req.body.time
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD)
        const adminId = decoded.id
        console.log(adminId)

        const value = [adminId, message, time]

        const sql = `INSERT  INTO messages (admin_id , message , time) VALUES(?)`

        connection.query(sql, [value], (err, result) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({ status: false, error: 'query errro' });
            }
            return res.status(200).json({ status: true, message: 'send succsessfully!' });
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: false, error: 'server error!' })
    }
})

// 

router.get('/get-message', async (req, res) => {

    try {
        const sql = 'SELECT * FROM messages'
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: false,
                    error: 'Failed to fetch teacher data from the database',
                });
            }
            return res.status(200).json({ status: true, result })
        })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// forgot password

router.post('/check-email', async (req, res) => {
    const email = req.body.email;

    try {
        const sql = 'SELECT * FROM admin WHERE email = ?';

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
                    INSERT INTO forgotTable (email, verification_code, expires_at, is_used)
                    VALUES (?, ?, ?, ?)
                `;

                connection.query(insertSql, [email, verificationCode, expiresAt, false], (insertErr) => {
                    if (insertErr) {
                        console.error(insertErr.message);
                        return res.status(500).json({ status: false, message: 'Failed to save verification code!' });
                    }

                    // Send the verification code via email
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'fuad47722@gmail.com',
                            pass: 'adyu juwc wdvb ukhf'
                        }
                    });

                    const mailOptions = {
                        from: 'fuad47722@gmail.com',
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
                return res.status(404).json({ status: false, message: 'Account not found!' });
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
            WHERE email = ? AND verification_code = ? AND expires_at > NOW() AND is_used = FALSE
        `;

        connection.query(sql, [email, verificationCode], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: false, message: 'Query error!' });
            }

            if (result.length > 0) {
                // Mark the code as used
                const updateSql = `UPDATE forgotTable SET is_used = TRUE WHERE email = ? AND verification_code = ?`;
                connection.query(updateSql, [email, verificationCode]);

                return res.status(200).json({ status: true, message: 'Verification successful!' });
            } else {
                return res.status(400).json({ status: false, message: 'Invalid or expired verification code!' });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});

module.exports = { admin: router };