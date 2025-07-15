import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCases } from '../features/cases/casesThunks';
import { CaseCard } from '../components/CaseCard';
import { CaseModal } from '../components/CaseModal';

export const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector(state => state.cases);
    const [openId, setOpenId] = useState<number | null>(null);

    useEffect(() => { dispatch(fetchCases()); }, [dispatch]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? <p>Ładowanie...</p> : list.map(c => (
                <CaseCard key={c.id} {...c} onOpen={id => setOpenId(id)} />
            ))}
            {openId && <CaseModal caseId={openId} onClose={() => setOpenId(null)} />}
        </div>
    );
};