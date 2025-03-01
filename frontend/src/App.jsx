import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import School from './school/School.jsx'
import Dashboard from './school/components/dashboard/Dashboard.jsx'
import Class from './school/components/class/Class.jsx'
import Examination from './school/components/examination/Examination.jsx'
import Notice from './school/components/notice/Notice.jsx'
import Schedule from './school/components/schedule/Schedule.jsx'
import Students from './school/components/students/Students.jsx'
import Subjects from './school/components/subjects/Subjects.jsx'
import Teachers from './school/components/teachers/Teachers.jsx'
import Client from './client/Client.jsx'
import Home from './client/component/home/Home.jsx'
import Login from './client/component/login/Login.jsx'
import Register from './client/component/register/Register.jsx'
import Teacher from './teacher/Teacher.jsx'
import TeacherDetails from './teacher/component/teacherDetails/TeacherDetails.jsx'
import AttendanceTeacher from './teacher/component/attendance/AttendanceTeacher.jsx'
import ExaminationTeacher from './teacher/component/examination/ExaminationTeacher.jsx'
import NoticeTeacher from './teacher/component/notice/NoticeTeacher.jsx'
import ScheduleTeacher from './teacher/component/schedule/ScheduleTeacher.jsx'
import Student from './student/Student.jsx'
import StudentDetails from './student/components/studentDetails/StudentDetails.jsx'
import AttendanceStudent from './student/components/attendance/AttendanceStudent.jsx'
import ExaminationStudent from './student/components/examination/ExaminationStudent.jsx'
import NoticeStudent from './student/components/notice/NoticeStudent.jsx'
import ScheduleStudent from './student/components/schedule/ScheduleStudent.jsx'
import ProtectedRoute from './guard/ProtectedRoute.jsx'
import { AuthContext } from './context/AuthContext.jsx'
import AttendanceStudentList from './school/components/attendance/AttendanceStudentList.jsx'
import AttendanceDetails from './school/components/attendance/AttendanceDetails.jsx'
import LogOut from './client/component/logout/LogOut.jsx'
import DraggableButton from './basicUtilityComponent/draggable/DraggableButton.jsx'
import { ThemeProvider } from '@emotion/react'
import { useContext } from 'react'
import darkTheme from './basicUtilityComponent/dark_theme/darkTheme'
import lightTheme from './basicUtilityComponent/light_theme/lightTheme'

function App() {
  const {dark} = useContext(AuthContext);

  return (
      <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        <DraggableButton />
        <BrowserRouter>
          <Routes>
            <Route path='school' element={<ProtectedRoute allowedRoles={['SCHOOL']}> <School /> </ProtectedRoute>}  >
              <Route index element={<Dashboard />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='attendance' element={<AttendanceStudentList />} />
              <Route path='attendance/:id' element={<AttendanceDetails />} />
              <Route path='class' element={<Class />} />
              <Route path='examination' element={<Examination />} />
              <Route path='notice' element={<Notice />} />
              <Route path='schedule' element={<Schedule />} />
              <Route path='students' element={<Students />} />
              <Route path='subjects' element={<Subjects />} />
              <Route path='teachers' element={<Teachers />} />
            </Route>

            <Route path='teacher' element={<ProtectedRoute allowedRoles={['TEACHER']}> <Teacher /> </ProtectedRoute>}>
              <Route index element={<TeacherDetails />} />
              <Route path='attendance' element={<AttendanceTeacher />} />
              <Route path='examination' element={<ExaminationTeacher />} />
              <Route path='notice' element={<NoticeTeacher />} />
              <Route path='schedule' element={<ScheduleTeacher />} />
            </Route>

            <Route path='student' element={<ProtectedRoute allowedRoles={['STUDENT']}> <Student /> </ProtectedRoute>}>
              <Route index element={<StudentDetails />} />
              <Route path='attendance' element={<AttendanceStudent />} />
              <Route path='examination' element={<ExaminationStudent />} />
              <Route path='notice' element={<NoticeStudent />} />
              <Route path='schedule' element={<ScheduleStudent />} />
            </Route>

            <Route path='/' element={<Client />}>
              <Route index element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/logout' element={<LogOut />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  )
}

export default App
