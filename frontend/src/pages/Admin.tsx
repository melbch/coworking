import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRooms, createRoom, deleteRoom } from "../api/api";
import type { Room } from "../types";
import { showRoomCreated, showRoomDeleted, showUserDeleted, showError } from "../utils/toast";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

type AdminUser = {
    _id: string;
    username: string;
    role: "User" | "Admin";
}

export default function Admin() {
    const auth = useContext(AuthContext);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState<number>(1);
    const [type, setType] = useState<"workspace" | "conference">("workspace");

    const [users, setUsers] = useState<AdminUser[]>([]);

    const [confirmDeleteRoomId, setConfirmDeleteRoomId] = useState<string | null>(null);
    const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            if (!auth?.token) return;

            try {
                const data = await getRooms(auth.token);
                setRooms(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load rooms");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [auth?.token]);

    const fetchUsers = useCallback(async () => {
        if (!auth?.token) return;

        try { 
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data: AdminUser[] = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    }, [auth?.token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.token) return;

        try {
            await createRoom({ name, capacity, type }, auth.token);
            setName("");
            setCapacity(1);
            setType("workspace");

            const data = await getRooms(auth.token);
            setRooms(data);

            showRoomCreated();
        } catch (err) {
            console.error(err);
            showError(err instanceof Error ? err.message: "Failed to create room");
        }
    };

    const handleDeleteRoom = async (id: string) => {
        if (!auth?.token) return;

        try {
            await deleteRoom(id, auth.token);
            setRooms(rooms.filter((r) => r._id !== id));

            showRoomDeleted();
        } catch (err) {
            console.error(err);
            showError(err instanceof Error ? err.message : "Failed to delete room");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!auth?.token) return;

        if (auth.user?.id === userId) {
            toast.error("You cannot delete your own admin account");
            return;
        }
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to delete user");
                return;
            }

            await fetchUsers();
            showUserDeleted();
        } catch (err) {
            console.error(err);
            showError(err instanceof Error ? err.message : "Failed to delete user");
        }
    };

    if (!auth?.user || auth.user.role !== "Admin") {
        return <p>Access denied. Only accessible to admins.</p>;
    }

    if (loading) { 
        return ( 
            <div className="fixed inset-0 flex items-center justify-center bg-darkBg text-white">
                <p className="text-xl font-display animate-pulse">Loading...</p>;
            </div> 
        ); 
    }

    if (error) return <p>{error}</p>;
    
    return (
        <>    
            <div className="min-h-screen bg-darkBg text-white p-6">
                <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

                <div className="max-w-xl mx-auto mb-10">

                    <div className="bg-darkBg/50 p-6 rounded-2xl mb-10">
                        <h2 className="text-xl font-semibold mb-6">Create Room</h2>
                        <form 
                            onSubmit={handleCreateRoom} 
                            className="bg-formBg p-6 rounded-xl shadow-lg mb-6 flex flex-col gap-4"
                        >
                            <input 
                                type="text"
                                placeholder="Room Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-darkBg text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryPurple"
                                required
                            />
                            <input 
                                type="number"
                                placeholder="capacity"
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}
                                min={1}
                                className="bg-darkBg text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryPurple"
                                required
                            />
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value as "workspace" | "conference")}
                                className="bg-darkBg text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryPurple"
                            >
                                <option value="workspace">Workspace</option>
                                <option value="conference">Conference</option>
                            </select>
                            <button 
                                type="submit"
                                className="bg-primaryGreen hover:bg-green-700 text-white rounded-lg py-2 font-medium transition"
                            >
                                Create Room
                            </button>
                        </form>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Rooms</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-darkBg/50 border border-gray-800 gap-6 p-6 mx-auto">
                    {rooms.length === 0 ? (
                        <p>No rooms found</p>
                    ) : (
                        rooms.map((r) => (
                            <div key={r._id} className="bg-formBg p-4 md:p-5 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between">
                                <h3 className="font-semibold text-lg mb-1">{r.name}</h3>

                                <p className="text-gray-400 text-sm">Capacity: {r.capacity}</p>

                                <span className={`
                                    mt-2 inline-block text-xs font-semibold px-2 py-2 rounded-lg
                                    ${r.type === "conference" ? "bg-primaryPurple/20 text-purple-800" : "bg-primaryGreen/20 text-green-800"}
                                `}>
                                    {r.type}
                                </span>
                                
                                <div className="mt-3 self-end">
                                    <button 
                                        onClick={() => setConfirmDeleteRoomId(r._id)}
                                        className="border border-red-600 text-red-600 mt-3 rounded-md text-sm py-1 px-3 hover:bg-red-700 hover:text-white transition"
                                    >
                                        Delete Room
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <h2 className="text-xl font-semibold mt-12 mb-4">Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-darkBg/50 border border border-gray-800 p-6 rounded-2xl mb-10">
                    {users.map(u => (
                        <div key={u._id} className="bg-formBg p-4 rounded-xl shadow-md flex justify-between items-center">
                            {/* Left */}
                            <div className="flex flex-col justify-center">
                                <span className="font-medium leading-tight">{u.username}</span>
                                <span className="text-xs text-gray-400 leading-tight">({u.role})</span>
                            </div>

                            {/* Right */}
                            <div className="flex items-center justify-center min-h-[40px]">
                                {u.role !== "Admin" ? (
                                    <button 
                                        onClick={() => setConfirmDeleteUserId(u._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1 hover:scale-105 active:scale-95 transition"
                                    >
                                     Delete
                                    </button>
                                ) : (
                                    <span className="text-xs text-gray-500 italic">Admin</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {confirmDeleteRoomId && (
                <ConfirmModal 
                    message="Are you sure you sure you want to delete this room?"
                    onConfirm={async () => {
                        if (confirmDeleteRoomId) {
                            await handleDeleteRoom(confirmDeleteRoomId);
                        }
                        setConfirmDeleteRoomId(null);
                    }}
                    onCancel={() => setConfirmDeleteRoomId(null)}
                />
            )}

            {confirmDeleteUserId && (
                <ConfirmModal 
                    message="Are you sure you sure you want to delete this user?"
                    onConfirm={async () => {
                        if (confirmDeleteUserId) {
                            await handleDeleteUser(confirmDeleteUserId);
                        }
                        setConfirmDeleteUserId(null);
                    }}
                    onCancel={() => setConfirmDeleteUserId(null)}
                />
            )}
        </>
    );
}