import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user, isLoading }) => {


    if (isLoading) {
        return null;
    }

   
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
