import type { Booking } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (data: {
    username: string;
    password: string;
}) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error("Failed to register");
    return res.json();
};

export const login = async (data: {
    username: string;
    password: string;
}) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to login");
    return res.json();
};

export const getRooms = async (token: string) => {
    const res = await fetch(`${API_URL}/rooms`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch rooms, status: ${res.status}`);
    return res.json();
};

export const getBookings = async (token: string): Promise<Booking[]> => {
    const res = await fetch(`${API_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
}

export const createBooking = async (
    booking: {
        roomId: string;
        startTime: string;
        endTime: string;
    },
    token: string
) => {
    const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
    });

    if (!res.ok) {
        throw new Error("Failed to create booking");
    }

    return res.json();
};

export const deleteBooking = async (id: string, token: string) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete booking");
    return res.json();
};

export const updateBooking = async (
    id: string,
    booking: {
        startTime: string;
        endTime: string;
    },
    token: string
) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
    });

    if (!res.ok) throw new Error("Failed to update booking");
    return res.json();
};

export const createRoom = async (
    room: {
        name: string;
        capacity: number;
        type: string;
    },
    token: string
) => {
    const res = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(room),
    });

    if (!res.ok) throw new Error("Failed to create room");
    return res.json();
};

export const deleteRoom = async (id: string, token: string) => {
    const res = await fetch(`${API_URL}/rooms/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete room");
    return res.json();
};