const jwt = require("jsonwebtoken");

function teacher(req, res, next) {
    const token = req.header("token");
    if (!token) {
        return res.status(400).send("Access Denied, No token Provided!");
    }
    try {
        const decode = jwt.verify(token, process.env.TEACHER_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

function teachers(req, res, next) {
    if (!req.user.teacher) {
        return res.status(403).send("Access denied");
    }
    next();
}

module.exports = { teacher, teachers };