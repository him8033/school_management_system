const express = require("express");
const authMiddleware = require("../auth/auth.js")
const { createSchedule, getSchedulesWithClass, updateScheduleWithId, deleteScheduleWithId, getSchedulesWithId } = require("../controllers/schedule.controller.js");
const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createSchedule);
router.get("/fetch-with-class/:id", authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), getSchedulesWithClass);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getSchedulesWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateScheduleWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteScheduleWithId);

module.exports = router;