import { useRoutes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Dashboard from "../pages/Dashboard"
import UserRoles from "../pages/UserRole"
import Process from "../pages/Process"
import PlantName from "../pages/PlantName"
import Employee from "../pages/Employee"
import Company from "../pages/Company"
import AssemblyLine from "../pages/AssemblyLine"
import ProtectedRoute from "./ProtectedRoute"
import MainLayout from "./Mainlayout"
import AssemblyLineStatus from "../pages/AssemblyLineStatus"
import PageNotFound from "../Components/PageNotFound/PageNotFound"


export const AppRoute = () => {
    const routes = [
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/",
            element: <MainLayout><Dashboard /></MainLayout>
        },
        {
            path: "/user-role",
            element: <MainLayout><UserRoles /></MainLayout>
        },
        {
            path: "/process",
            element: <MainLayout><Process /></MainLayout>
        },
        {
            path: "/plant-name",
            element: <MainLayout><PlantName /></MainLayout>
        },
        {
            path: "/employee",
            element: <MainLayout><Employee /></MainLayout>
        },
        {
            path: "/company",
            element: <MainLayout><Company /></MainLayout>
        },
        {
            path: "/assembly-line",
            element: <MainLayout><AssemblyLine /></MainLayout>
        },
        {
            path: "/assembly-line-status",
            element: <MainLayout><AssemblyLineStatus /></MainLayout>
        },
        {
            path: "/*",
            element: <PageNotFound />
        }

    ]
    return useRoutes(routes);
}
  