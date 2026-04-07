import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomList from "../components/RoomList";
import { AuthContext } from "../context/AuthContext";
import type { Booking } from "../types";
import socket from "../socket";
import { showBookingCreated } from "../utils/toast";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

interface BookingCreatedEvent {
    booking: Booking;
}

export default function Dashboard() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

    useEffect(() => {
        const handleBookingCreated = (data: BookingCreatedEvent) => {
            console.log("Booking created event received:", data);
            showBookingCreated();
        };

        socket.on("bookingCreated", handleBookingCreated);

        return () => {
            socket.off("bookingCreated", handleBookingCreated);
        };
    }, []);

    const handleDeleteAccount = async () => {
        if (!auth?.token) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            auth.logout(); //user will be logged out after account is deleted
            navigate("/register");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account");
        }
    }
    
    return (
        <div className="min-h-screen bg-darkBg text-white px-8 pb-8 flex flex-col">
            <div className="mt-16 flex justify-between items-center">
                <h1 className="text-2xl font-semibold font-display">
                    Welcome, {auth?.user?.username}
                </h1>

                <button
                    onClick={auth?.logout}
                    className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-primaryGreen to-primaryPurple hover:from-primaryPurple hover:to-primaryGreen transition-all duration-200"
                >
                    Logout
                </button>
            </div> 

            {/* Quick actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-4 mt-8">
                <div 
                    onClick={() => navigate("/bookings")}
                    className="bg-formBg p-6 rounded-md cursor-pointer hover:scale-105 transition"
                >
                    <h2 className="text-lg front-semibold mb-2">
                        {auth?.user?.role === "Admin" ? "Bookings" : "My Bookings"}
                    </h2>
                    <p className="text-gray-400">
                        {auth?.user?.role === "Admin"
                            ? "View and manage all active bookings"
                            : "View and manage your bookings"}
                    </p>
                </div>

                {auth?.user?.role === "Admin" && (
                    <div
                        onClick={() => navigate("/admin")}
                        className="bg-formBg p-6 rounded-md cursor-pointer hover:scale-105 transition border border-primaryPurple"
                    >
                        <h2 className="text-lg font-semibold mb-2 text-primaryPurple">
                            Admin Panel
                        </h2>
                        <p className="text-gray-400">Manage users and rooms</p>
                    </div>
                )}
            </div>

            {/* Preview section */}
            <div className="bg-formBg p-6 rounded-2xl flex-grow">
                <h2 className="text-lg font-semibold mb-4">
                    Available Rooms
                </h2>

                <RoomList />
            </div>

            {auth?.user?.role !== "Admin" && (
                <>
                    <hr className="my-10 border-gray-700" />
                    <div className="bg-red-900/20 border border-red-700 p-6 rounded-2xl">
                        <h2 className="text-red-400 font-semibold mb-2">
                            Danger Zone
                        </h2>
                        <p className="text-gray-400 mb-4 text-sm">
                            This action is permanent and cannot be undone.
                        </p>
                    
                        <button
                            onClick={() => setConfirmDeleteAccount(true)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                            Delete my account
                        </button>
                    </div>
                </>
            )}

            {confirmDeleteAccount && (
                <ConfirmModal 
                    message="Are you sure you want to delete your account? This action cannot be undone."
                    onConfirm={async () => {
                        await handleDeleteAccount();
                        setConfirmDeleteAccount(false);
                    }}
                    onCancel={() => setConfirmDeleteAccount(false)}
                />
            )}
        </div>
    );
}