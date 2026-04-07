import type { Room } from "../types";

export function getRoomImage(room: Room) {
    const variantCountMap: Record<string, number> = {
        "conference-6": 1,
        "conference-8": 4,
        "conference-10": 1,
        "conference-18": 1,
        "conference-25": 1,
        "workspace-2": 3,
        "workspace-4": 6,
        "workspace-5": 1,
        "workspace-7": 1
    };

    const key = `${room.type}-${room.capacity}`;
    const maxVariants = variantCountMap[key];

    if (!maxVariants) {
        return `/assets/rooms/default.jpg`;
    }

    const variant = Math.floor(Math.random() * maxVariants) + 1;
    return `/assets/rooms/${key}-${variant}.jpg`;
}