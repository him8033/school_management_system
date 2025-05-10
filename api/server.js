require ("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const schoolRouter = require("./routers/school.router.js");
const classRouter = require("./routers/class.router.js");
const subjectRouter = require("./routers/subject.router.js");
const studentRouter = require("./routers/student.router.js");
const teacherRouter = require("./routers/teacher.router.js");
const scheduleRouter = require("./routers/schedule.router.js");
const attendanceRouter = require("./routers/attendance.router.js");
const examinationRouter = require("./routers/examination.router.js");
const noticeRouter = require("./routers/notice.router.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'client/build')));
const corsOption = {
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    exposedHeaders: "Authorization"
};
app.use(cors(corsOption));
app.options("*", cors(corsOption));
app.use(cookieParser());

const MongoURL = process.env.LOCAL_MONGO_URL;
const dbURL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("MongoDB is Connected Successfully.");
    }).catch((err) => {
        console.log("MongoDB Error =",err);
    })

async function main() {
    await mongoose.connect(dbURL);
}

app.use("/api/school", schoolRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/examination", examinationRouter);
app.use("/api/notice", noticeRouter);

app.get("/api/testing", (req, res) => {
    res.send("Server is Working Properly.")
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is listning on Port-", PORT);
})