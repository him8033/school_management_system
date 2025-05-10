# 📁 Project Structure – School Management System

```bash
School Management
├── api/
│   ├── auth/
|   |   ├── auth.js
│   ├── controllers/
|   |   ├── attendance.controller.js
|   |   ├── class.controller.js
|   |   ├── examination.controller.js
|   |   ├── notice.controller.js
|   |   ├── schedule.controller.js
|   |   ├── school.controller.js
|   |   ├── student.controller.js
|   |   ├── subject.controller.js
|   |   └── teacher.controller.js
│   ├── models/
|   |   ├── attendance.model.js
|   |   ├── class.model.js
|   |   ├── examination.model.js
|   |   ├── notice.model.js
|   |   ├── schedule.model.js
|   |   ├── school.model.js
|   |   ├── student.model.js
|   |   ├── subject.model.js
|   |   └── teacher.model.js
│   ├── routers/
|   |   ├── attendance.router.js
|   |   ├── class.router.js 
|   |   ├── examination.router.js
|   |   ├── notice.router.js
|   |   ├── schedule.router.js
|   |   ├── school.router.js
|   |   ├── student.router.js
|   |   ├── subject.router.js
|   |   └── teacher.router.js
│   ├── utils/
|   |   ├── computeCosineSimilarit.js
│   ├── .env
│   ├── cloudConfig.js
│   ├── package-lock.json
│   ├── package.json
│   └──server.js
├── frontend
│   ├── public/
│   └── src/
|   |   ├── basicUtilityComponent/
|   |   │   ├── dark_theme/
|   |   │   │   └── darkTheme.js
|   |   │   ├── draggable/
|   |   │   │   └── DraggableButton.jsx
|   |   │   ├── light_theme/
|   |   │   │   └── lightTheme.js
|   |   │   └── snackbar/
|   |   │       └── MessageSnackbar.jsx
|   |   ├── client/
|   |   │   ├── component/
|   |   │   │   ├── home/
|   |   │   │   │   ├── caursel/
|   |   │   │   │   │   └── Carousel.jsx
|   |   │   │   │   ├── gallery/
|   |   │   │   │   │   └── Gallery.jsx
|   |   │   │   │   ├── Home.jsx
|   |   │   │   ├── login/
|   |   │   │   │   └── Login.jsx
|   |   │   │   ├── logout/
|   |   │   │   │   └── LogOut.jsx
|   |   │   │   ├── register/
|   |   │   │   │   └── Register.jsx
|   |   │   │   └── utilityComponent/
|   |   │   │       ├── footer/
|   |   │   │       │   └── Footer.jsx
|   |   │   │       ├── navbar/
|   |   │   │       │   └── Navbar.jsx
|   |   │   └── Client.jsx
|   |   ├── context/
|   |   │   └── AuthContext.jsx
|   |   ├── guard/
|   |   │   └── ProtectedRoute.jsx
|   |   ├── school/
|   |   │   ├── components/
|   |   │   │   ├── attendance/
|   |   │   │   │   ├── AttendanceDetails.jsx
|   |   │   │   │   ├── AttendanceStudentList.jsx
|   |   │   │   │   └── Attendee.jsx
|   |   │   │   ├── class/
|   |   │   │   │   └── Class.jsx
|   |   │   │   ├── dashboard/
|   |   │   │   │   └── Dashboard.jsx
|   |   │   │   ├── examination/
|   |   │   │   │   └── Examination.jsx
|   |   │   │   ├── notice/
|   |   │   │   │   └── Notice.jsx
|   |   │   │   ├── schedule/
|   |   │   │   │   ├── Schedule.jsx
|   |   │   │   │   └── ScheduleEvent.jsx
|   |   │   │   ├── students/
|   |   │   │   │   └── Students.jsx
|   |   │   │   ├── subjects/
|   |   │   │   │   └── Subjects.jsx
|   |   │   │   ├── teachers/
|   |   │   │   │   └── Teachers.jsx
|   |   │   └── School.jsx
|   |   ├── student/
|   |   │   ├── components/
|   |   │   │   ├── attendance/
|   |   │   │   │   └── AttendanceStudent.jsx
|   |   │   │   ├── examination/
|   |   │   │   │   └── ExaminationStudent.jsx
|   |   │   │   ├── notice/
|   |   │   │   │   └── NoticeStudent.jsx
|   |   │   │   ├── schedule/
|   |   │   │   │   └── ScheduleStudent.jsx
|   |   │   │   └── studentDetails/
|   |   │   │       └── StudentDetails.jsx
|   |   │   └── Student.jsx
|   |   ├── teacher/
|   |   │   ├── component/
|   |   │   │   ├── attendance/
|   |   │   │   │   └── AttendanceTeacher.jsx
|   |   │   │   ├── examination/
|   |   │   │   │   └── ExaminationTeacher.jsx
|   |   │   │   ├── notice/
|   |   │   │   │   └── NoticeTeacher.jsx
|   |   │   │   ├── schedule/
|   |   │   │   │   └── ScheduleTeacher.jsx
|   |   │   │   └── teacherDetails/
|   |   │   │       └── TeacherDetails.jsx
|   |   │   └── Teacher.jsx
|   |   ├── yupSchema/
|   |   │   ├── classSchema.js
|   |   │   ├── examinationSchema.js
|   |   │   ├── loginSchema.js
|   |   │   ├── noticeSchema.js
|   |   │   ├── periodSchema.js
|   |   │   ├── registerSchema.js
|   |   │   ├── studentSchema.js
|   |   │   ├── subjectSchema.js
|   |   │   └── teacherSchema.js
|   |   ├── App.css
|   |   ├── App.jsx
|   |   ├── environment.js
|   |   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
```