const jwt = require("jsonwebtoken");

function student(req, res, next) {
    const token = req.header("token");
    if (!token) {
        return res.status(400).send("Access Denied, No token Provided!");
    }
    try {
        const decode = jwt.verify(token, process.env.STUDENT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

function students(req, res, next) {
    if (!req.user.student) {
        return res.status(403).send("Access denied");
    }
    next();
}

module.exports = { student, students };