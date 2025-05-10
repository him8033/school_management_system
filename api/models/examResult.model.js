const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examResultSchema = new Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: "School",
        required: true
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
        required: true
    },
    examId: {
        type: mongoose.Schema.ObjectId,
        ref: "Examination",
        required: true
    },
    obtainedMarks: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    percentage: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pass", "Fail"],
        required: true
    },
    division: {
        type: String,
        enum: ["First Division", "Second Division", "Third Division", "Fail"],
        required: true
    },
    details: [
        {
            question: {
                type: mongoose.Schema.ObjectId,
                ref: "Question",
                required: true
            },
            studentAnswer: {
                type: String,
            },
            isCorrect: {
                type: Boolean,
                required: true
            },
            marksObtained: {
                type: Number,
                required: true
            }
        }
    ],
    attemptedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ExamResult", examResultSchema);
