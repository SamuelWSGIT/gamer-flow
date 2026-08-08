import { Navigate, Outlet } from "react-router"

export function ProtectedRoute() {

    const token = sessionStorage.getItem('token')
    
    if (!token) {
        return <Navigate to="/auth/login" replace />
    }

    return <Outlet />
}