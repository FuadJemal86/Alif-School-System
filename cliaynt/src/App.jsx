import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import HomeParent from '../componets/home/HomeParent';
import Login from '../componets/home/loginPage/Login';


function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element = {<Login/>}/>
        {/* <Route path='/contact' element = {<ContactParent/>}/> */}
      </Routes>
    </Router>
  )
}

export default App
