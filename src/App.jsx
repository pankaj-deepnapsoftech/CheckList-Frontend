import { Route, Router, Routes } from 'react-router-dom';
import './App.css'
import Login from './component/Login';
import UserRole from './page/UserRole';
import Process from './page/Process';
import PlantName from './page/PlantName';
import Employee from './page/Employee';
import Company from './page/Company';
import AssemblyLineStatus from './page/AssemblyLineStatus';
import AssemblyLine from './page/AssemblyLine';
import Dashboard from './page/Dashboard';
function App() {
 

  return (
<<<<<<< HEAD
    <>

      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
=======
    <> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-role" element={<UserRole />} />
          <Route path="/process" element={<Process />} />
          <Route path="/plant-name" element={<PlantName />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/company" element={<Company />} />
          <Route path="/assembly-line-status" element={<AssemblyLineStatus />} />
          <Route path="/assembly-line" element={<AssemblyLine />} />
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
>>>>>>> dff3df18a47bc2820092f91b964a932542e65dfa
    </>
  );
}

export default App
