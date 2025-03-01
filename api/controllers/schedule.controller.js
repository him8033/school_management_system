const Schedule = require("../models/schedule.model")

module.exports = {

    getSchedulesWithClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const schoolId = req.user.schoolId;
            const schedules = await Schedule.find({ school: schoolId, class: classId }).populate(['teacher', 'subject']);
            res.status(200).json({ success: true, message: "Successfully fetching All Schedules.", data: schedules });
        } catch (error) {
            console.log("Get Schedules with Class Error:- ", error);
            res.status(500).json({ success: false, message: "Server Error in getting Schedules with Class." });
        }
    },

    createSchedule: async (req, res) => {
        try {
            const newSchedule = new Schedule({
                school: req.user.schoolId,
                teacher: req.body.teacher,
                subject: req.body.subject,
                class: req.body.selectedClass,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
            })
            await newSchedule.save();
            res.status(200).json({ success: true, message: "Successfully created the Schedule." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Server error in creating Schedule." });
        }
    },

    getSchedulesWithId: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const schedule = (await Schedule.find({ school: schoolId, _id: id }))[0];
            res.status(200).json({ success: true, message: "Successfully fetching All Schedules.", data: schedule });
        } catch (error) {
            console.log("Get Schedules with Class Error:- ", error);
            res.status(500).json({ success: false, message: "Server Error in getting Schedules with Class." });
        }
    },

    updateScheduleWithId: async (req, res) => {
        try {
            let id = req.params.id;
            await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
            const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
            res.status(200).json({ success: true, message: "Schedule Updated.", data: scheduleAfterUpdate });
        } catch (error) {
            console.log("Update Schedule Error:- ", error);
            res.status(500).json({ success: false, message: "Server error in Updating Schedule." });
        }
    },

    deleteScheduleWithId: async (req, res) => {
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;
            await Schedule.findOneAndDelete({ _id: id, school: schoolId });
            res.status(200).json({ success: true, message: "Schedule Deleted Successfully." });
        } catch (error) {
            console.log("Delete Schedule Error:- ", error);
            res.status(500).json({ success: false, message: "Server error in Deleting Schedule." });
        }
    }
}