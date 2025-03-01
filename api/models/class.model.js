const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: "School"
    },
    class_text: {
        type: String,
        required: true
    },
    class_num: {
        type: String,
        required: true
    },
    attendee: {
        type: mongoose.Schema.ObjectId,
        ref: "Teacher"
    },
    createAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Class", classSchema);