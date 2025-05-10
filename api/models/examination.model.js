const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["MCQ", "Text"],
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    options: {
        type: [String],
        required: function() {
            return this.type === "MCQ";
        }
    },
    correctAnswer: {
        type: Schema.Types.Mixed, // String for MCQ, Text Answer for Text type
        required: true
    }
});

const examinationSchema = new Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: "School"
    },
    examDate: {
        type: Date,
        required: true
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: "Subject"
    },
    examType: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    questions: [questionSchema],
    class: {
        type: mongoose.Schema.ObjectId,
        ref: "Class"
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Examination", examinationSchema);