import React, { useEffect } from 'react';

interface ConfirmationMessageProps {
    isVisible: boolean;
    name: string;
    date: Date | null;
    package: string;
    price: number;
    time?: string
    onClose: () => void;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({
    isVisible,
    name,
    date,
    package: packageName,
    price,
    time,
    onClose,
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 4000); // försvinner efter 4 sekunder
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const dateStr = date?.toLocaleDateString("sv-SE");

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-2xl border-4 border-green-500 p-10 max-w-lg w-full mx-4 relative'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition'
                >
                    ✕
                </button>

                <div className='text-center'>
                    <div className='text-5xl mb-5'>✅</div>
                    <h2 className='text-2xl font-bold text-green-700 mb-4'>
                        Tack för din bokning!
                    </h2>

                    <div className='bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-4'>
                        <p><strong>Namn:</strong> {name}</p>
                        <p><strong>Datum:</strong> {dateStr}</p>
                        <p><strong>Paket:</strong> {packageName}</p>
                        {time && <p><strong>Tid:</strong> {time}</p>}
                        <p className="text-lg"><strong className="text-blue-600">Pris:</strong> <span className="text-blue-600">{price} kr</span></p>
                    </div>

                    <p className="text-gray-600 text-sm">
                        En bekräftelse har skickats till din e-post
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationMessage;