import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user, isLoading, children }) => {
    const location = useLocation();

    if (isLoading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (user?.is_admin === true) {
        return children;
    }

    const permissions = user?.userRole?.permissions || [];
    const currentPath = location.pathname;
    const hasAccess = permissions.includes(currentPath);

    if (!hasAccess) {
        const redirectPath = permissions[0] || "/";
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
