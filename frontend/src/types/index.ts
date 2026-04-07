export type User = {
    _id: string;
    username: string;
    role: "User" | "Admin";
};

export type Room = {
    _id: string;
    name: string;
    capacity: number;
    type: "workspace" | "conference";
};

export type Booking = {
    _id: string;
    roomId: { _id: string; name: string} | string;
    userId: { _id: string, username: string } | string;
    startTime: string;
    endTime: string;
};