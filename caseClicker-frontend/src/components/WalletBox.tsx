import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet, topUpWallet } from '../redux/walletService/Action';
import toast from 'react-hot-toast';
import type {RootState} from "../redux/store.tsx";

export const WalletBox: React.FC = () => {
    const dispatch = useDispatch();
    const { balance, loading, error } = useSelector((state: RootState) => state.wallet);
    const [amount, setAmount] = useState<number>(10);

    useEffect(() => {
        dispatch(fetchWallet() as any);
    }, [dispatch]);

    const handleTopUp = async () => {
        try {
            await (dispatch(topUpWallet(amount) as any));
            toast.success(`Doładowano ${amount} monet`);
        } catch (err: any) {
            toast.error(err.message || 'Błąd doładowania');
        }
    };

    if (loading) return <p>Ładowanie portfela…</p>;
    if (error)   return <p className="text-red-500">Błąd: {error}</p>;

    return (
        <div className="p-4 bg-blue-100 rounded shadow mb-4">
            <p className="text-lg font-semibold">Saldo: {balance} 🪙</p>
            <div className="mt-2 flex items-center gap-2">
                <input
                    type="number"
                    className="border p-1 rounded w-20"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                />
                <button
                    onClick={handleTopUp}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Doładuj
                </button>
            </div>
        </div>
    );
};
