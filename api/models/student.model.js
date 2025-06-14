const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: "School"
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    student_class: {
        type: mongoose.Schema.ObjectId,
        ref: "Class"
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    guardian: {
        type: String,
        required: true
    },
    guardian_phone: {
        type: String,
        required: true
    },
    student_image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    examResults: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "ExamResult"
        }
    ],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Student", studentSchema);