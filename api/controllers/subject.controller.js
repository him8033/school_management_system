const Subject = require("../models/subject.model")
const Exam = require("../models/examination.model")
const Schedule = require("../models/schedule.model")

module.exports = {

    getAllSubjects: async(req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const allSubjects = await Subject.find({school: schoolId});
            res.status(200).json({success: true, message: "Successfully fetching All Subjects.", data: allSubjects});
        } catch (error) {
            console.log("GetAllSubjects Error:- ", error);
            res.status(500).json({success: false, message: "Server Error in getting Subjects."});
        }
    },

    createSubject: async(req, res) => {
        try {
            const newSubject = new Subject({
                school: req.user.schoolId,
                subject_name: req.body.subject_name,
                subject_codename: req.body.subject_codename,
            })
            await newSubject.save();
            res.status(200).json({success: true, message: "Successfully created the Subject."});
        } catch (error) {
            res.status(500).json({success: false, message: "Server error in creating Subject."});
        }
    },

    updateSubjectWithId: async(req, res) => {
        try {
            let id = req.params.id;
            await Subject.findOneAndUpdate({_id: id}, {$set: {...req.body}});
            const subjectAfterUpdate = await Subject.findOne({_id: id});
            res.status(200).json({success: true, message: "Subject Updated.", data: subjectAfterUpdate});
        } catch (error) {
            console.log("Update Subject Error:- ", error);
            res.status(500).json({success: false, message: "Server error in Updating Subject."});
        }
    },

    deleteSubjectWithId: async(req, res) => {
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;

            const subjectExamCount = (await Exam.find({subject: id, school: schoolId})).length;
            const subjectScheduleCount = (await Schedule.find({subject: id, school: schoolId})).length;

            if((subjectExamCount === 0) && (subjectScheduleCount === 0)){
                await Subject.findOneAndDelete({_id: id, school: schoolId});
                res.status(200).json({success: true, message: "Subject Deleted Successfully."});
            }else{
                res.status(500).json({success: false, message: "This Subject is Already is in Used."});
            }
        } catch (error) {
            console.log("Delete Subject Error:- ", error);
            res.status(500).json({success: false, message: "Server error in Deleting Subject."});

        }
    }
}