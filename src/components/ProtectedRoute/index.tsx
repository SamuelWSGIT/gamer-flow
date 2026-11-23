import { Navigate, Outlet } from "react-router";
import { getAuthToken } from "../../services/user";

export function ProtectedRoute( ){
    const token = getAuthToken();

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}
