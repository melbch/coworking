import type { Booking, Room } from "../types";

type Props = {
    booking: Booking & { roomId: Room & { imageUrl: string } };
    onEdit?: (booking: Booking) => void;
    onCancel?: (id: string) => void;
}

export default function BookingCard({ booking, onEdit, onCancel }: Props) {
    const room = typeof booking.roomId === "object" ? booking.roomId as Room & { imageUrl?: string } : null;

    return (
        <div className="bg-darkBg p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition max-w-md w-full mx-auto">
            {room && (
                <img 
                    src={room?.imageUrl}
                    alt={room.name}
                    className="w-full h-40 object-cover rounded-t-md mb-4"
                />
            )}

            <h3 className="text-lg font-semibold mb-2 text-white">
                {room?.name}
            </h3>

            <p className="text-gray-400">Booked by: {typeof booking.userId === "object" ? booking.userId.username : booking.userId}</p>
            <p className="text-gray-400">From: {new Date(booking.startTime).toLocaleString()}</p>
            <p className="text-gray-400 mb-4">To: {new Date(booking.endTime).toLocaleString()}</p>

            <div className="flex gap-4 justify-center">
                {onCancel && (
                    <button 
                        onClick={() => onCancel(booking._id)}
                        className="px-6 py-2 rounded-lg text-white font-semibold border-2 border-red-600 bg-transparent hover:bg-red-700 transition-colors"
                    >
                        Cancel
                    </button>
                )}

                {onEdit && (
                    <button 
                        onClick={() => onEdit(booking)}
                        className="px-6 py-2 rounded-lg text-white font-semibold border-2 border-primaryGreen bg-transparent hover:bg-primaryGreen transition-colors"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    )
}