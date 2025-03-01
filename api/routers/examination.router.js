const express = require("express");
const authMiddleware = require("../auth/auth.js")
const { newExamination, getAllExamination, getExaminationByClass, updateExaminationWithId, deleteExaminationWithId } = require("../controllers/examination.controller.js");
const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), newExamination);
router.get("/all", authMiddleware(['SCHOOL']), getAllExamination);
router.get("/class/:id", authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), getExaminationByClass);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateExaminationWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteExaminationWithId);

module.exports = router;