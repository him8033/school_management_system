const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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