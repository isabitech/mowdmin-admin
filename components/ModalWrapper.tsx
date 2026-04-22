'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: string;
}

export default function ModalWrapper({
    isOpen,
    onClose,
    children,
    maxWidth = 'max-w-2xl',
}: ModalWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 "
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95`}
            >
                {/* Scrollable Content */}
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}