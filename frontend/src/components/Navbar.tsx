import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const auth = useContext(AuthContext);

    return (
        <nav className="bg-darkBg shadow-md py-6 px-4 flex justify-between items-center">
            <div>
                <Link 
                    to="/dashboard"
                    className="text-2xl font-bold font-heading bg-gradient-to-r from-primaryPurple to-primaryGreen bg-clip-text text-transparent hover:from-primaryGreen hover:to-primaryPurple transition-all duration-300"
                >
                    Coworking
                </Link>
            </div>

            <div className="flex items-center space-x-6">
                <Link 
                    to="/dashboard"
                    className="text-white hover:text-primaryGreen transition"
                >
                    Dashboard
                </Link>
                <Link 
                    to="/bookings"
                    className="text-white hover:text-primaryGreen transition"
                >
                    Bookings
                </Link>
                {auth?.user?.role === "Admin" && (
                    <Link 
                        to="/admin"
                        className="text-primaryPurple hover:text-primaryGreen transition"
                    >
                        Admin
                    </Link>
                )}

                {auth?.token && (
                    <div className="group p-[1px] rounded-lg bg-gradient-to-r from-primaryGreen to-primaryPurple hover:from-red-500 hover:to-red-700 transition">
                        <button 
                            onClick={auth.logout}
                            className="bg-darkBg text-gray-300 group-hover:text-red-400 px-3 py-1 rounded-lg transition w-full h-full"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}