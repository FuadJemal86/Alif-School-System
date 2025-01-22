const express = require('express');
const { admin } = require('./Route/admin');
const { teacher } = require('./Route/teacher');
const { student } = require('./Route/student');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors({
    origin: 'https://alif-school-system.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials: true,
}));


app.get("/", (req, res) => {
    res.send("Welcome to Alif API!");
});
app.use(express.json());
app.use('/auth', admin);
app.use('/teacher', teacher);
app.use('/student', student);
app.use(express.static('public'));




// Start the server
app.listen(process.env.PORT || 3032, () => {
    console.log(`Server is running on port ${process.env.PORT || 3032}`);
});
