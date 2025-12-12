import { Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import UserRole from "./pages/UserRole";
import Process from "./pages/Process";
import PlantName from "./pages/PlantName";
import Employee from "./pages/Employee";
import Company from "./pages/Company";
import AssemblyLineStatus from "./pages/AssemblyLineStatus";
import AssemblyLine from "./pages/AssemblyLine";
import Dashboard from "./pages/Dashboard";
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
          <Route
            path="/assembly-line-status"
            element={<AssemblyLineStatus />}
          />
          <Route path="/assembly-line" element={<AssemblyLine />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
