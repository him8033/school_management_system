const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
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
    qualification: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    teacher_image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Teacher", teacherSchema);