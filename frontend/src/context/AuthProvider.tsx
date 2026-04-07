import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;

        try {
            return JSON.parse(stored);
        } catch (err) {
            console.error("Invalid user in localStorage", err);
            localStorage.removeItem("user"); //remove harmful data
            return null;
        }
    });

    const loginUser = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
    };

    return (
        <AuthContext.Provider value={{ token, user, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};