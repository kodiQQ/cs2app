import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../redux/store';
import {fetchHistory} from "../redux/historyService/Action.ts";

export const HistoryList: React.FC = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state: RootState) => state.history);

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchHistory());
    }, [dispatch]);

    if (loading) return <p>Ładowanie historii...</p>;
    if (error) return <p className="text-red-500">Błąd: {error}</p>;

    return (
        <div className="space-y-3">
            {items.length === 0 ? (
                <p>Brak historii.</p>
            ) : (
                items.map((entry) => (
                    <div
                        key={entry.id}
                        className="p-3 border rounded bg-white shadow-sm"
                    >
                        <p><strong>Przedmiot:</strong> {entry.item.name} ({entry.item.rarity})</p>
                        <p className="text-sm text-gray-500">
                            Otworzono: {new Date(entry.opened_at).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};
