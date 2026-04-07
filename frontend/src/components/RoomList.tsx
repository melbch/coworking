import { useEffect, useState, useContext } from "react";
import { getRooms } from "../api/api";
import type { Room } from "../types";
import { AuthContext } from "../context/AuthContext";
import BookingForm from "./BookingForm";
import RoomCard from "./RoomCard";

export default function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const auth = useContext(AuthContext);
    

    useEffect(() => {
        const fetchRooms = async () => {
            if (!auth?.token) return;

            try {
                const data = await getRooms(auth.token);
                setRooms(data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, [auth?.token]);

    return (
        <div>
            {rooms.length === 0 ? (
                <p className="text-gray-400">
                    No rooms available
                </p>
            ): (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                    {rooms.map((room) => (
                        <RoomCard key={room._id} room={room}>
                            <BookingForm roomId={room._id}/>
                        </RoomCard>
                    ))}
                </div>
            )}
        </div>
    );
}