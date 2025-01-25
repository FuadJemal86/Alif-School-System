const express = require('express');
const { admin } = require('./Route/admin');
const { teacher } = require('./Route/teacher');
const { student } = require('./Route/student');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(helmet());
app.use(cors({
    origin: 'https://alif-school-system.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

// Prevent NoSQL injection & XSS
app.use(mongoSanitize());

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to Alif API!");
});
app.use('/auth', admin);
app.use('/teacher', teacher);
app.use('/student', student);


// Start the server
app.listen(process.env.PORT || 3032, () => {
    console.log(`Server is running on port ${process.env.PORT || 3032}`);
});








