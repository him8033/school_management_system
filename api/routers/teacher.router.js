const express = require("express");
const authMiddleware = require("../auth/auth.js")
const { registerTeacher, getTeacherWithQuery, loginTeacher, updateTeacher, getTeacherWithId, deleteTeacherWithId, getTeacherOwnData } = require("../controllers/teacher.controller.js");
const router = express.Router();

router.post("/register",authMiddleware(['SCHOOL']), registerTeacher);
router.get("/fetch-with-query", authMiddleware(['SCHOOL']), getTeacherWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateTeacher);
router.get("/fetch-single", authMiddleware(['TEACHER']), getTeacherOwnData);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getTeacherWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteTeacherWithId);

module.exports = router;