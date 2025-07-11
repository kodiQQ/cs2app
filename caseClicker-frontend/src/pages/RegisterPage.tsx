import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction } from '../redux/authService/Action';
import type { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(registerAction({ email, password }) as any);
            navigate('/login');
        } catch {
            // błędy -> auth.error
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Rejestracja</h2>
            {auth.error && <p className="text-red-600">{auth.error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email" placeholder="Email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="password" placeholder="Hasło"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 rounded"
                    disabled={auth.loading}
                >
                    {auth.loading ? 'Ładowanie...' : 'Zarejestruj się'}
                </button>
            </form>
        </div>
    );
}
