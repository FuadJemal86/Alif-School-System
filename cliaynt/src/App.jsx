import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../componets/home/loginPage/Login';
import StudentLogin from '../componets/home/loginPage/StudentLogin';
import AdminLogin from '../componets/home/loginPage/AdminLogin';
import HomeParent from '../componets/home/HomeParent';
import ContactParent from '../componets/home/contact/contact css/ContactParent';
import AdminNav from '../componets/admin/AdminNav';
import Subjects from '../componets/admin/subject/Subjects';
import AddSubject from '../componets/admin/subject/AddSubject';
import Teacher from '../componets/admin/teachers/Teacher';
import AddTeacher from '../componets/admin/teachers/AddTeacher';
import Class from '../componets/admin/classes/Class';
import AddClass from '../componets/admin/classes/AddClass';
import EditTeacher from '../componets/admin/teachers/EditTeacher';
import Student from '../componets/admin/student/Student';
import AddStudent from '../componets/admin/student/AddStudent';
import EditStudent from '../componets/admin/student/EditStudent';
import Grade from '../componets/admin/grade/Grade';
import AjestGrade from '../componets/admin/grade/AjestGrade';
import EnterGrade from '../componets/admin/grade/EnterGrade';
import EditGrade from '../componets/admin/grade/EditGrade';
import Parent from '../componets/admin/parent/Parent';
import AddParent from '../componets/admin/parent/AddParent';
import EnterParent from '../componets/admin/student/EnterParent';
import AddAccount from '../componets/admin/addAccount/AddAccount';
import AdminProfile from '../componets/admin/AdminProfile';
import EditAdmin from '../componets/admin/EditAdmin';
import Dashbord from '../componets/admin/dashbord/Dashbord';
import Notification from '../componets/admin/Notification';
import Dipartment from '../componets/admin/dipartment/Dipartment';
import AddDipartement from '../componets/admin/dipartment/AddDipartement';
import Sitting from '../componets/admin/sitting/Sitting';
import Nav from '../componets/teacher/teacherNav/Nav';
import StudentList from '../componets/teacher/teacherNav/studentLst/StudentList';
import StudentGrade from '../componets/teacher/teacherNav/studentLst/StudentGrade';
import GradeList from '../componets/teacher/teacherNav/studentLst/GradeList';
import Attendance from '../componets/teacher/teacherNav/studentLst/Attendance';
import EditAttendance from '../componets/teacher/teacherNav/studentLst/EditAttendance';
import TeacherProfile from '../componets/teacher/teacherNav/teacher profile/TeacherProfile';
import EditTeacherProfile from '../componets/teacher/teacherNav/teacher profile/EditTeacherProfile';
import Assisment from '../componets/teacher/teacherNav/studentLst/Assisment';
import AddMarke from '../componets/teacher/teacherNav/studentLst/AddMarke';
import SendMessage from '../componets/admin/send message/SendMessage';
import Message from '../componets/teacher/teacherNav/Message';
import History from '../componets/teacher/teacherNav/studentLst/History';
import TeacherDashbord from '../componets/teacher/teacherNav/studentLst/TeacherDashbord';
import StudentProfile from '../componets/student/StudentProfile';
import EditStudentProfile from '../componets/student/EditStudentProfile';
import ForgotEmail from '../componets/forgotpassword/ForgotEmail';
import PasswordVerfication from '../componets/forgotpassword/PasswordVerfication';



function App() {
  return (
    <Router>
      <Routes>

        {/* home */}

        <Route path='/' element={<HomeParent />} />

        {/* Main Login Routes */}

        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/techer-login' element={<Login />} />
        <Route path='/student-login' element={<StudentLogin />} />
        <Route path='/forgot-email' element={<ForgotEmail />} />
        <Route path='/password-verfication' element={<PasswordVerfication />} />

        {/* Contact Page */}
        <Route path='/contact' element={<ContactParent />} />



        {/* Admin Dashboard */}
        <Route path='/admin-dashbord' element={<AdminNav />}>
          <Route path='' element={<Dashbord />} />
          <Route path='subject' element={<Subjects />} />
          <Route path='add-subject' element={<AddSubject />} />
          <Route path='teacher' element={<Teacher />} />
          <Route path='add-teacher' element={<AddTeacher />} />
          <Route path='class' element={<Class />} />
          <Route path='add-class' element={<AddClass />} />
          <Route path='edit-teacher/:id' element={<EditTeacher />} />
          <Route path='student' element={<Student />} />
          <Route path='add-student' element={<AddStudent />} />
          <Route path='edit-student/:id' element={<EditStudent />} />
          <Route path='grade' element={<Grade />} />
          <Route path='ajest-grade' element={<AjestGrade />} />
          <Route path='enter-grade/:id' element={<EnterGrade />} />
          <Route path='edit-grade/:id' element={<EditGrade />} />
          <Route path='parent' element={<Parent />} />
          <Route path='add-parent' element={<AddParent />} />
          <Route path='enter-parent/:id' element={<EnterParent />} />
          <Route path='add-account' element={<AddAccount />} />
          <Route path='admin-profile' element={<AdminProfile />} />
          <Route path='edit-admin/:id' element={<EditAdmin />} />
          <Route path='notification' element={<Notification />} />
          <Route path='dipartmen' element={<Dipartment />} />
          <Route path='add-dipartmen' element={<AddDipartement />} />
          <Route path='sitting' element={<Sitting />} />
          <Route path='send-message' element={<SendMessage />} />
        </Route>

        <Route path='/teacher-nav' element={<Nav />}>
          <Route path='dashbord' element={<TeacherDashbord />} />
          <Route path='student-list' element={<StudentList />} />
          <Route path='add-grade/:id' element={<StudentGrade />} />
          <Route path='grade-list' element={<GradeList />} />
          <Route path='attendance' element={<Attendance />} />
          <Route path='edit-attendance/:id' element={<EditAttendance />} />
          <Route path='teacher-profile' element={<TeacherProfile />} />
          <Route path='edit-teacher/:id' element={<EditTeacherProfile />} />
          <Route path='assisment' element={<Assisment />} />
          <Route path='add-mark/:id' element={<AddMarke />} />
          <Route path='notification' element={<Message />} />
          <Route path='history' element={<History />} />

        </Route>

        <Route path='/student-profile' element={<StudentProfile />} />
        <Route path='/edit-profile/:id' element={<EditStudentProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
