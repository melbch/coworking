import { useState, useContext } from "react";
import { login } from "../api/api";
import { AuthContext, type User } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const parseJwt = (token: string) => {
        try {
            const base64Payload = token.split(".")[1];
            const payload = atob(base64Payload);
            return JSON.parse(payload);
        } catch (err) {
            console.error("Failed to parse token", err);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = await login(form);
            
            const decoded = parseJwt(data.token);
            if (!decoded) throw new Error("Failed to decode token");

            const user: User = {
                id: decoded.id,
                username: form.username,
                role: decoded.role
            };

            auth?.loginUser(data.token, user);

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-darkBg p-4">
            <div className="p-[1px] bg-gradient-to-r from-primaryGreen to-primaryPurple rounded-sm">
                <form 
                    onSubmit={handleSubmit}
                    className="bg-formBg p-8 rounded-sm w-full max-w-sm"
                >
                    <h2 
                        className="text-4xl font-bold mb-6 text-center font-heading bg-clip-text text-transparent transition-transform duration-200"
                        style={{ 
                            backgroundImage: "linear-gradient(90deg, #22C55E, #A855F7)"
                        }} 
                    >
                        Coworking
                    </h2>
                    <input
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        className="w-full mb-4 px-4 py-2 rounded-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        className="w-full mb-4 px-4 py-2 rounded-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                    />

                    <div className="flex justify-center">
                        <button 
                            type="submit"
                            className="w-40 mx-auto py-2 rounded text-white font-semibold transition-all bg-gradient-to-r from-primaryGreen to-primaryPurple hover:from-green-800 hover:to-purple-900"
                        >
                            Sign in
                        </button>
                    </div>

                    <p className="text-gray-400 mt-4 text-center">
                        Don't have an account?{" "} 
                        <a href="/register" className="text-primaryPurple hover:underline">
                            Register here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}