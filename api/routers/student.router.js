const express = require("express");
const authMiddleware = require("../auth/auth.js")
const { registerStudent, getStudentWithQuery, loginStudent, updateStudent, getStudentWithId, deleteStudentWithId, getStudentOwnData } = require("../controllers/student.controller.js");
const router = express.Router();

router.post("/register",authMiddleware(['SCHOOL']), registerStudent);
router.get("/fetch-with-query", authMiddleware(['SCHOOL', 'TEACHER']), getStudentWithQuery);
router.post("/login", loginStudent);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateStudent);
router.get("/fetch-single", authMiddleware(['STUDENT']), getStudentOwnData);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getStudentWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteStudentWithId);

module.exports = router;