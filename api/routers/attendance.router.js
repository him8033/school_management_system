const express = require("express");
const authMiddleware = require("../auth/auth.js")
const { markAttendance, getAttendance, checkAttendance } = require("../controllers/attendance.controller.js");
const router = express.Router();

router.post("/mark", authMiddleware(['TEACHER']), markAttendance);
router.get("/:studentId", authMiddleware(['SCHOOL', 'STUDENT']), getAttendance);
router.get("/check/:classId", authMiddleware(['TEACHER']), checkAttendance);

module.exports = router;