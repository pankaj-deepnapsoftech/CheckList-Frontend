import { Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import UserRole from "./page/UserRole";
import Process from "./page/Process";
import PlantName from "./page/PlantName";
import Employee from "./page/Employee";
import Company from "./page/Company";
import AssemblyLineStatus from "./page/AssemblyLineStatus";
import AssemblyLine from "./page/AssemblyLine";
import Dashboard from "./page/Dashboard";
import MainLayout from "./layout/Mainlayout";


function App() {
  return (
    <>
      <Routes>

     
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />   
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-role" element={<UserRole />} />
          <Route path="/process" element={<Process />} />
          <Route path="/plant-name" element={<PlantName />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/company" element={<Company />} />
          <Route path="/assembly-line-status" element={<AssemblyLineStatus />} />
          <Route path="/assembly-line" element={<AssemblyLine />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
