const express = require('express');
const {admin} = require('./Route/admin')
const cors = require('cors');
const {teacher} = require('./Route/teacher');
const {student} = require('./Route/student');
require('dotenv').config()



const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT','DELETE','UPDATE'],
    credentials: true, 
}));

app.use(express.json())
// app.use(sanitaze.middleware())
app.use('/auth',admin)
app.use('/teacher',teacher)
app.use('/student',student)
app.use(express.static('public'))






app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3032');
});
