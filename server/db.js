const connection = require('./db/db connection/connection');

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');

    const schoolDatabase = [

        `CREATE TABLE IF NOT EXISTS admin (
            id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE,
            password VARCHAR(100) NOT NULL,
            image VARCHAR(255),
            UNIQUE (email)
        );`,

        `CREATE TABLE IF NOT EXISTS subjects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT
        );`,

        `CREATE TABLE IF NOT EXISTS classes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            class_name VARCHAR(50) NOT NULL
        );`,

        `CREATE TABLE IF NOT EXISTS dip (
            id INT AUTO_INCREMENT PRIMARY KEY,
            dip_name VARCHAR(100) NOT NULL
        );`,

        `CREATE TABLE IF NOT EXISTS teachers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            password VARCHAR(250) NOT NULL,
            subject_id INT NULL,
            class_id INT NULL,
            email VARCHAR(100) UNIQUE,
            image VARCHAR(255),
            phone VARCHAR(15),
            address TEXT,
            UNIQUE (email),
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
        );`,

        `CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            dip_id INT,
            name VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE,
            image VARCHAR(255),
            dob DATE NULL,
            gender ENUM('Male', 'Female'),
            class_id INT,
            address TEXT,
            UNIQUE (email),
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
            FOREIGN KEY (dip_id) REFERENCES dip(id) ON DELETE CASCADE
        );`,

        `CREATE TABLE IF NOT EXISTS attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            class_id INT NOT NULL,
            attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
            status ENUM('Present', 'Absent', '-') NOT NULL DEFAULT '-',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
            UNIQUE KEY unique_attendance (student_id, class_id, attendance_date)
        );`,

        `CREATE TABLE IF NOT EXISTS grades (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            subject_id INT NOT NULL,
            grade VARCHAR(10),
            date DATE NOT NULL DEFAULT CURRENT_DATE,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        );`,

        `CREATE TABLE IF NOT EXISTS parents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            contact VARCHAR(50),
            student_id INT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        );`,

        `CREATE TABLE IF NOT EXISTS schedule (
            id INT AUTO_INCREMENT PRIMARY KEY,
            class_id INT NOT NULL,
            subject_id INT NOT NULL,
            day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
            time TIME,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        );`,

        `CREATE TABLE IF NOT EXISTS teacherInfo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            image VARCHAR(50),
            discription VARCHAR(50)
        );`,

        `CREATE TABLE IF NOT EXISTS schoolImags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image VARCHAR(100),
            discription VARCHAR(50)
        );`,

        `CREATE TABLE IF NOT EXISTS contact (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(50),
            message VARCHAR(50)
        );`,

        `CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NOT NULL,
            message VARCHAR(100) NOT NULL,
            time VARCHAR(50),
            FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
        );`,

        `CREATE TABLE IF NOT EXISTS history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            class_id INT NOT NULL,
            attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
            status ENUM('Present', 'Absent', '-') NOT NULL DEFAULT '-'
        )`,

        `CREATE TABLE IF NOT EXISTS exams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            teacher_id INT NOT NULL,
            student_id INT NOT NULL,
            class_id INT NOT NULL,
            subject_id INT NOT NULL,
            assi1 FLOAT NOT NULL,
            assi2 FLOAT NOT NULL,
            midterm FLOAT NOT NULL,
            final FLOAT NOT NULL,
            average FLOAT AS (assi1 + assi2 + midterm + final) STORED,
            FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        );`
    ];

    const resetAttendanceEvent = `
        CREATE EVENT IF NOT EXISTS reset_attendance_status
        ON SCHEDULE EVERY 12 HOUR
        DO
        BEGIN
            UPDATE attendance
            SET status = '-', updated_at = NOW()
            WHERE status != '-' AND attendance_date = CURDATE();
        END;
    `;

    const executeQueries = (queries) => {
        queries.forEach((query, index) => {
            connection.query(query, (err) => {
                if (err) {
                    console.error(`Error executing query ${index + 1}:`, err.message);
                } else {
                    console.log(`Table created/verified for query ${index + 1}`);
                }
            });
        });

        // Execute the event creation query
        connection.query(resetAttendanceEvent, (err) => {
            if (err) {
                console.error('Error creating reset_attendance_status event:', err.message);
            } else {
                console.log('Event reset_attendance_status created/verified successfully.');
            }
        });
    };

    executeQueries(schoolDatabase);
});

module.exports = connection;
