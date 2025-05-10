const Examination = require("../models/examination.model");
const Student = require("../models/student.model");
const ExamResult = require("../models/examResult.model");
const { computeCosineSimilarity } = require("../utils/computeCosineSimilarity.js");

module.exports = {

    newExamination: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const { date, subjectId, examType, duration, totalMarks, passingMarks, isActive, questions, classId } = req.body;
            const newExamination = new Examination({
                school: schoolId,
                examDate: date,
                subject: subjectId,
                examType: examType,
                duration: duration,
                totalMarks: totalMarks,
                passingMarks: passingMarks,
                isActive: isActive,
                questions: questions,
                class: classId
            })

            const saveData = await newExamination.save();
            res.status(200).json({ success: true, message: "New Examination is created Successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Creating New Examination." });
        }
    },

    getAllExamination: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinations = await Examination.find({ school: schoolId });
            res.status(200).json({ success: true, examinations });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Fetching Examination." });
        }
    },

    getExaminationByClass: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const classId = req.params.id;
            const examinations = await Examination.find({ school: schoolId, class: classId }).populate("subject");
            res.status(200).json({ success: true, examinations });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Fetching Examination by Class." });
        }
    },

    getExaminationById: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examId = req.params.id;
            const exam = await Examination.find({ school: schoolId, _id: examId }).select("-questions.correctAnswer").populate("subject");
            res.status(200).json({ success: true, exam });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Fetching Examination by Id." });
        }
    },

    submitExamination: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const studentId = req.user.id;
            const examId = req.params.id;
            const { answers } = req.body;

            const exam = await Examination.findOne({ school: schoolId, _id: examId }).select("questions totalMarks passingMarks");
            if (!exam) {
                return res.status(404).json({ error: "Exam not found" });
            }

            let totalMarks = exam.totalMarks;
            let obtainedMarks = 0;
            let results = [];

            for (const q of exam.questions) {
                const studentAnswer = answers[q._id] || "";
                let isCorrect = false;
                let marksObtained = 0;

                if (q.type === "MCQ") {
                    isCorrect = q.correctAnswer === studentAnswer;
                    marksObtained = isCorrect ? q.marks : 0;
                } else if (q.type === "Text") {
                    const similarity = computeCosineSimilarity(studentAnswer, q.correctAnswer);
                    let result = (similarity / 100) * q.marks;
                    isCorrect = similarity >= 80;
                    marksObtained = isCorrect ? q.marks : Math.round(result);
                }

                obtainedMarks += marksObtained;

                results.push({
                    question: q._id,
                    studentAnswer,
                    isCorrect,
                    marksObtained,
                });
            };

            const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
            const isPassed = obtainedMarks >= exam.passingMarks;
            let division = "Fail";
            if (isPassed) {
                if (percentage >= 60) division = "First Division";
                else if (percentage >= 50) division = "Second Division";
                else if (percentage >= 40) division = "Third Division";
            }

            const newExamResult = new ExamResult({
                school: schoolId,
                student: studentId,
                examId: examId,
                obtainedMarks,
                totalMarks,
                percentage,
                status: isPassed ? "Pass" : "Fail",
                division,
                details: results,
                attemptedAt: new Date()
            });

            await newExamResult.save();
            await Student.findByIdAndUpdate(studentId, { $push: { examResults: newExamResult._id } });

            res.status(200).json({
                success: true,
                message: "Exam Submitted Successfully",
                obtainedMarks,
                totalMarks,
                percentage: percentage + "%",
                status: isPassed ? "Pass" : "Fail",
                division,
                details: results
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Submitting Examination." });
        }
    },

    updateExaminationWithId: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinationId = req.params.id;
            const { date, subjectId, examType, duration, totalMarks, passingMarks, isActive, questions } = req.body;
            await Examination.findOneAndUpdate({ _id: examinationId, school: schoolId },
                {
                    $set: {
                        examDate: date,
                        subject: subjectId,
                        examType: examType,
                        duration: duration,
                        totalMarks: totalMarks,
                        passingMarks: passingMarks,
                        isActive: isActive,
                        questions: questions,
                    }
                });
            res.status(200).json({ success: true, message: "Examination updated Successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Updating Examination." });
        }
    },

    deleteExaminationWithId: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinationId = req.params.id;
            await Examination.findOneAndDelete({ _id: examinationId, school: schoolId });
            res.status(200).json({ success: true, message: "Examination Deleted Successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Deleting Examination." });
        }
    },
}