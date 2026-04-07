import toast from "react-hot-toast";

export const showBookingCreated = () => toast.success('Booking created!');

export const showBookingUpdated = () => toast.promise(
    new Promise<void>((resolve) => setTimeout(resolve, 1000)),
    {
        loading: "Saving changes...",
        success: "Booking updated!",
        error: "Failed to update booking",
    },
    {
        style: {
            background: "#030013",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "1rem",
            padding: "0.75rem 1.5rem",
        },
        position: "bottom-right",
    }
);

export const showBookingDeleted = () => toast.success('Booking deleted!');

export const showRoomCreated = () => toast.success('Room created!');
export const showRoomDeleted = () => toast.success('Room deleted!');

export const showUserDeleted = () => toast.success('User deleted!');

export const showError = (message: string) => toast.error(`⚠️ ${message}`, {
    style: {
        background: "#B00020",
        color: "#fff",
        fontWeight: "bold",
    },
    position: "bottom-right",
});