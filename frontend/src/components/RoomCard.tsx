import type { Room } from "../types";
import { getRoomImage } from "../utils/roomUtils";

type Props = {
    room: Room;
    children?: React.ReactNode;
}

export default function RoomCard({ room, children }: Props) {
    return (
        <div className="bg-darkBg p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold mb-2">
                {room.name}
            </h3>

            <img 
                src={getRoomImage(room)}
                alt={room.name}
                className="w-full h-40 object-cover rounded-t-md mb-3"
            />

            <p className="text-gray-400">
                Capacity: {room.capacity}
            </p>

            <p className="text-gray-500 mb-4 capitalize">
                {room.type}
            </p>

            <div className="border-t border-gray-700 pt-4">
                {children}
            </div>
        </div>
    );
}