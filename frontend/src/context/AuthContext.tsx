import { createContext } from "react";

export type User = {
    id: string;
    username: string;
    role: "User" | "Admin";
};

export type AuthContextType = {
    token: string | null;
    user: User | null;
    loginUser: (token: string, user: User) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);