import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { getBookings, getRooms, deleteBooking } from "../api/api";
import type { Booking, Room } from "../types";
import BookingForm from "../components/BookingForm";
import BookingCard from "../components/BookingCard";
import socket from "../socket";
import { getRoomImage } from "../utils/roomUtils";
import { showBookingUpdated, showBookingDeleted } from "../utils/toast";
import ConfirmModal from "../components/ConfirmModal";

export default function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [editBooking, setEditBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useContext(AuthContext);
    const formRef = useRef<HTMLDivElement>(null);
    const [confirmDeleteBookingId, setConfirmDeleteBookingId] = useState<string | null>(null);

    useEffect(() => {
        if (!auth?.token) return;
        const token = auth.token;
        
        const fetchData = async () => {
            try {
                const [bookingsData, roomsData] = await Promise.all([
                    getBookings(token),
                    getRooms(token)
                ]);
                setBookings(bookingsData);
                setRooms(roomsData)
            } catch (err) {
                console.error(err);
                setError("Failed to load bookings or rooms");   
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth?.token]);

    useEffect(() => {
        const handleBookingUpdated = (data: { booking: Booking }) => {
            console.log("Booking updated event received:", data);
            setBookings(prev =>
                prev.map(b => (b._id === data.booking._id ? data.booking : b))
            );
            showBookingUpdated();
        };

        const handleBookingDeleted = (data: { booking: Booking }) => {
            console.log("Booking deleted event received:", data);
            setBookings(prev => prev.filter(b => b._id !== data.booking._id));
            showBookingDeleted();
        };

        socket.on("bookingUpdated", handleBookingUpdated);
        socket.on("bookingDeleted", handleBookingDeleted);

        return () => {
            socket.off("bookingUpdated", handleBookingUpdated);
            socket.off("bookingDeleted", handleBookingDeleted);
        };
    }, []);

    useEffect(() => {
        if (editBooking && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [editBooking]);

    const handleDelete = async (id: string) => {
        setConfirmDeleteBookingId(id);
    };

    if (!auth?.token) return <p>Please log in to see your bookings</p>;
    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="min-h-screen bg-darkBg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {auth?.user?.role === "Admin" ? "All Bookings" : "My Bookings"}
            </h2>

            {editBooking && (
                <div ref={formRef} className="mb-6 flex justify-center">
                    <div className="w-full max-w-sm">
                        <BookingForm 
                            roomId={typeof editBooking.roomId === "object" && "_id" in editBooking.roomId 
                                ? editBooking.roomId._id 
                                : (editBooking.roomId as string)
                        }
                            booking={editBooking}
                            onBookingCreated={() => {
                                setEditBooking(null);
                                getBookings(auth.token!).then(setBookings);
                            }}
                        />
                    </div>
                </div>
            )}

            {bookings.length === 0 ? (
                <p className="text-gray-400 text-center mt-6">No bookings found</p>
            ) : (
                <div className="bg-formBg p-6 rounded-2xl">
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map(b => {
                            let roomObj: Room | undefined;
                        
                            if (typeof b.roomId === "string") {
                                roomObj = rooms.find(r => r._id === b.roomId);
                            } else {
                                const roomIdObj = b.roomId as { _id: string; name: string };
                                roomObj = rooms.find(r => r._id === roomIdObj._id);
                            }
                        
                            if (!roomObj) return null;

                            const roomWithImage = {
                                ...roomObj,
                                imageUrl: getRoomImage(roomObj)
                            };

                            return (
                                <BookingCard 
                                    key={b._id}
                                    booking={{ ...b, roomId: roomWithImage }}
                                    onEdit={setEditBooking}
                                    onCancel={handleDelete}
                                />
                            )
                        })}
                    </div>
                </div>
            )}

            {confirmDeleteBookingId && (
                <ConfirmModal 
                    message="Are you sure you want to cancel this booking?"
                    onConfirm={async () => {
                        if (!auth?.token) return;
                        try {
                            await deleteBooking(confirmDeleteBookingId, auth.token);
                            setBookings(prev => prev.filter(b => b._id !== confirmDeleteBookingId));
                        } catch (err) {
                            console.error(err);
                        }
                        setConfirmDeleteBookingId(null);
                    }}
                    onCancel={() => setConfirmDeleteBookingId(null)}
                />
            )}
        </div>
    );
}