import { Navigate } from "react-router"

export function Logout() {
    sessionStorage.removeItem('token')

    return <Navigate to="/auth/login" replace />
}