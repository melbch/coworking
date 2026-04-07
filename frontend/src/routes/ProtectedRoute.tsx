import { useContext } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";

type Props = {
    children: ReactNode;
    requiredRole?: "User" | "Admin";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
    const auth = useContext(AuthContext);

    if (!auth?.token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && auth.user?.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>;
}