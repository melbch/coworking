import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createBooking , updateBooking} from "../api/api";
import type { Booking } from "../types";
import { showError } from "../utils/toast";
import toast from "react-hot-toast";

type Props = {
    roomId: string;
    booking?: Booking;
    onBookingCreated?: (booking: Booking) => void;
};

export default function BookingForm({ roomId, booking, onBookingCreated }: Props) {
    const [startTime, setStartTime] = useState(booking ? booking.startTime.slice(0, 16) : "");
    const [endTime, setEndTime] = useState(booking ? booking.endTime.slice(0, 16) : "");
    const [loading, setLoading] = useState(false);
    const auth = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!auth?.token) {
            toast.error("You must be logged in");
            return;
        }

        if (!startTime || !endTime) {
            toast.error("Please select start and end time");
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            toast.error("End time must be after start time");
            return;
        }

        try {
            setLoading(true);
            
            if (booking) {
                await updateBooking(
                    booking._id,
                    {
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                    },
                    auth.token
                );
                onBookingCreated?.(booking);
            } else {
                const newBooking = await createBooking(
                    {
                        roomId,
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                    },
                    auth.token
                );

                setStartTime("");
                setEndTime("");
                onBookingCreated?.(newBooking);
            }

        } catch(error: unknown) {
            console.error(error);
            const err = error as { message?: string };
            showError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            {/* Start time */}
            <div>
                <label className="text-sm text-gray-400 mb-1">
                    Start Time
                </label>
                <input 
                    type="datetime-local" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)} 
                    className="
                        bg-formBg
                        border border-gray-700
                        rounded-lg
                        px-3 py-3
                        text-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primaryPurple
                        w-full
                        [color-scheme:dark]
                    "
                />
            </div>
            

            {/* End time */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">
                    End Time
                </label>
                <input 
                    type="datetime-local" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="
                        bg-formBg
                        border border-gray-700
                        rounded-lg
                        px-3 py-3
                        text-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primaryPurple
                        w-full
                        [color-scheme:dark]
                    " 
                />
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className={`
                    mt-2
                    px-4 py-2
                    rounded-lg
                    font-medium
                    transition
                    ${loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-primaryGreen hover:bg-green-700"
                    }
                `}
            >
                {loading 
                    ? "Saving..." 
                    : booking 
                    ? "Update Booking" 
                    : "Book"}
            </button>
        </form>
    );
}