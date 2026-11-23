import { Navigate } from "react-router";
import { clearSession } from "../../services/user";

export function Logout() {
    clearSession();

    return <Navigate    to="/auth/login" replace />;
}
