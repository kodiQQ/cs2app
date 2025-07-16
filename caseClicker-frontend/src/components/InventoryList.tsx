import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../redux/inventoryService/Action';
import type { RootState } from '../redux/store';

export const InventoryList: React.FC = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state: RootState) => state.inventory);

    useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    if (loading) return <p>Ładowanie inventory...</p>;
    if (error) return <p className="text-red-500">Błąd: {error}</p>;
    if (list.length === 0) return <p>Brak przedmiotów w inventory.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(({ id, item, obtained_at }) => (
                <div key={id} className="border rounded p-4 shadow">
                    <h4 className="font-bold">{item.name}</h4>
                    <p>Rzadkość: <span className="capitalize">{item.rarity}</span></p>
                    <p className="text-sm text-gray-500">
                        Zdobyte: {new Date(obtained_at).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
};
