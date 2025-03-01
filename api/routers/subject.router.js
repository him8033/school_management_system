const express = require("express");
const authMiddleware = require("../auth/auth.js")
const { createSubject, getAllSubjects, updateSubjectWithId, deleteSubjectWithId } = require("../controllers/subject.controller.js");
const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createSubject);
router.get("/all", authMiddleware(['SCHOOL']), getAllSubjects);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateSubjectWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteSubjectWithId);

module.exports = router;