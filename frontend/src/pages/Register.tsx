import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";
import { AuthContext, type User } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const auth = useContext(AuthContext);
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await register({ username, password });

            const user: User = data.user;
            auth?.loginUser(data.token, user);

            navigate("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown registration error");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-darkBg p-4">
            <div className="p-[1px] bg-gradient-to-r from-primaryGreen to-primaryPurple rounded-sm">
                <form 
                    onSubmit={handleRegister}
                    className="bg-formBg p-8 rounded-sm shadow-lg w-full max-w-sm"
                >
                    <h2 
                        className="text-4xl font-bold mb-6 text-center font-heading bg-clip-text text-transparent transition-transform duration-200"
                        style={{ 
                            backgroundImage: "linear-gradient(90deg, #22C55E, #A855F7)"
                        }} 
                    >
                        Register
                    </h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <input 
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 rounded-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 rounded-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                    />
                    
                    <div className="flex justify-center">
                        <button 
                            type="submit"
                            className="w-40 mx-auto py-2 rounded text-white font-semibold transition-all bg-gradient-to-r from-primaryGreen to-primaryPurple hover:from-green-800 hover:to-purple-900"
                        >
                            Register
                        </button>
                    </div>

                    <p className="text-gray-400 mt-4 text-center">
                        Already have an account?{" "} 
                        <a href="/login" className="text-primaryPurple hover:underline">
                            Sign in
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;