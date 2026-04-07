import type { FC } from "react";
import { useEffect } from "react";

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    
    return (
        <div className="fixed p-6 inset-0 flex items-start justify-center bg-black/50 z-50">
            <div className="p-[2px] bg-gradient-to-r from-primaryGreen to-primaryPurple rounded-xl">
                <div className="bg-darkBg p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
                    <p className="mb-4">{message}</p>
                    <div className="flex justify-end gap-2">
                        <div className="rounded-lg p-[2px] bg-gradient-to-r from-primaryGreen to-primaryPurple inline-block">
                            <button
                                onClick={onCancel}
                                className="
                                    px-4 py-2 rounded-lg
                                    bg-darkBg
                                    text-white
                                    hover:bg-gradient-to-r hover:from-primaryGreen hover:to-primaryPurple 
                                    transition-all duration-200
                                    w-full
                                "
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-700 hover:text-white transition"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;