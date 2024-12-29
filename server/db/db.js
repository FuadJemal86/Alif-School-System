const connection = require('../db Conection/connect')


connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');




    const schoolDatabase = [

        `CREATE TABLE classes (
        class_id INT AUTO_INCREMENT PRIMARY KEY,
        class_name VARCHAR(50) NOT NULL,
        teacher_id INT,
        FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
    );`,


        `CREATE TABLE subjects (
        subject_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
    );`,


        `CREATE TABLE teachers (
        teacher_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subject_id INT,
        email VARCHAR(100),
        phone VARCHAR(15),
        address TEXT,
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    );`,


        `CREATE TABLE students (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dob DATE,
        gender ENUM('Male', 'Female'),
        class_id INT,
        address TEXT,
        parent_contact VARCHAR(50),
        FOREIGN KEY (class_id) REFERENCES classes(class_id)
    );`,


        `CREATE TABLE enrollments (
        enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        class_id INT NOT NULL,
        enrollment_date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (class_id) REFERENCES classes(class_id)
    );`,


        `CREATE TABLE attendance (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        class_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent', 'Late'),
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (class_id) REFERENCES classes(class_id)
    );`,


        `CREATE TABLE grades (
        grade_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        subject_id INT NOT NULL,
        grade VARCHAR(10),
        date DATE,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    );`,


        `CREATE TABLE parents (
        parent_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact VARCHAR(50),
        student_id INT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    );`,


        `CREATE TABLE schedule (
        schedule_id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        subject_id INT NOT NULL,
        day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        time TIME,
        FOREIGN KEY (class_id) REFERENCES classes(class_id),
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    );`,


        `CREATE TABLE fees (
        fee_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        due_date DATE,
        status ENUM('Paid', 'Unpaid'),
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    );`
    ];

    const executeQueries = (queries) => {
        let index = 0;

        const next = () => {
            if (index < queries.length) {
                connection.query(queries[index], (err) => {
                    if (err) {
                        console.error(`Error executing query ${index + 1}:`, err.message);
                    } else {
                        console.log(`Table created/verified for query ${index + 1}`);
                    }
                    index++;
                    next();
                });
            }
        };

        next();
    };


    executeQueries(schoolDatabase);
})
