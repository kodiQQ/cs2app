import React from 'react';
interface Props { id: number; name: string; description: string; price: number; onOpen: (id: number) => void; }
export const CaseCard: React.FC<Props> = ({ id, name, description, price, onOpen }) => (
    <div className="bg-white rounded p-4 shadow">
        <h3 className="text-xl font-bold">{name}</h3>
        <p>{description}</p>
        <button onClick={() => onOpen(id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Otwórz ({price} 🪙)
        </button>
    </div>
);