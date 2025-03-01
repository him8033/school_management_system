const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoticeSchema = new Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: "School"
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    audience: {
        type: String,
        enum: ["student", "teacher"],
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Notice", NoticeSchema);