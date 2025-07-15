import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openCase } from '../redux/casesService/Action';
import type { RootState } from '../redux/store';

export function CaseModal({ caseId, onClose }: { caseId: number; onClose: () => void }) {
    const dispatch = useDispatch();
    const { opening, lastOpened, openError } = useSelector((state: RootState) => state.cases);

    React.useEffect(() => {
        // @ts-ignore
        dispatch(openCase(caseId));
    }, [dispatch, caseId]);

    if (opening) return <p>Otwarcie...</p>;
    if (openError) return <p className="text-red-500">Błąd: {openError}</p>;

    return (
        <div>
            {lastOpened && (
                <div>
                    <h2>Wygrałeś: {lastOpened.item.name} ({lastOpened.item.rarity})</h2>
                    <p>Nowy stan portfela: {lastOpened.balance} 🪙</p>
                </div>
            )}
            <button onClick={onClose}>Zamknij</button>
        </div>
    );
}
