import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import UserRoles from "../pages/UserRole";
import Process from "../pages/Process";
import PlantName from "../pages/PlantName";
import Employee from "../pages/Employee";
import Company from "../pages/Company";
import AssemblyLine from "../pages/AssemblyLine";
import MainLayout from "./Mainlayout";
import AssemblyLineStatus from "../pages/AssemblyLineStatus";
import PageNotFound from "../Components/PageNotFound/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";
import { useLogin } from "../hooks/useLogin";
import ForgetPassword from "../pages/auth/ForgetPassword";
import CheckItem from "../pages/CheckItem";
import Parts from "../pages/Parts";
import CheckItemsData from "../pages/CheckItemsData";
import CheckItemHistory from "../pages/CheckItemHistory";
import AssignedAssemblyLines from "../pages/AssignedAssemblyLines";
import UserDashboard from "../pages/UserDashboard";
import AssemblyError from "../pages/AssemblyError";
import ErrorforAdmin  from "../pages/ErrorforAdmin";
import Department from "../pages/Department";
import DailyCheckAssembly from "../pages/DailyAssemblyCheck";
import TemplateMaster from "../TemplateMasterPages/TemplateMaster";
import ReleaseGroups from "../TemplateMasterPages/ReleaseGroups";

export const AppRoute = () => {
  const { logedinUser } = useLogin();

  const user = logedinUser.data;
  const isLoading = logedinUser.isLoading;

  const withProtection = (Component) => (
    <ProtectedRoute user={user} isLoading={isLoading}>
      <MainLayout>
        <Component />
      </MainLayout>
    </ProtectedRoute>
  );

  return useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgetPassword /> },
    {
      path: "/",
      element: withProtection(user?.is_admin ? Dashboard : UserDashboard),
    },
    { path: "/user-role", element: withProtection(UserRoles) },
    { path: "/process", element: withProtection(Process) },
    { path: "/parts", element: withProtection(Parts) },
    { path: "/plant-name", element: withProtection(PlantName) },
    { path: "/department", element: withProtection(Department) },
    { path: "/employee", element: withProtection(Employee) },
    { path: "/company", element: withProtection(Company) },
    { path: "/assembly-line", element: withProtection(AssemblyLine) },
    { path: "/release-group", element: withProtection(ReleaseGroups) },
    { path: "/template-master", element:withProtection(TemplateMaster) },
    { path: "/workflow", element:withProtection(TemplateMaster) },
    
    {
      path: "/assembly-line-status",
      element: withProtection(AssemblyLineStatus),
    },
    user?.is_admin === false && {
      path: "/assembly-line/error",
      element: withProtection(AssemblyError),
    },

    {path: "/assembly-line-admin/error", element: withProtection(ErrorforAdmin)},

    { path: "/checkitem", element: withProtection(CheckItem) },
    { path: "/checkitem-data", element: withProtection(CheckItemsData) },
    {
      path: "/check-item-history",
      element: withProtection(CheckItemHistory),
    },
    {
      path: "/assigned-assembly-lines",
      element: withProtection(!user?.is_admin ? AssignedAssemblyLines : PageNotFound)
    },
    {
      path: "/daily-assembly-check",
      element: withProtection(!user?.is_admin ? DailyCheckAssembly : PageNotFound)
    },
    { path: "/*", element: <PageNotFound /> },
  ]);
};
