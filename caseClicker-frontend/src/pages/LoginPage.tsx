import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../redux/authService/Action';
import type { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginAction({ email, password }) as any);
            navigate('/');
        } catch {
            // błędy trafią do auth.error
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Logowanie</h2>
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
                    className="bg-blue-600 text-white py-2 rounded"
                    disabled={auth.loading}
                >
                    {auth.loading ? 'Ładowanie...' : 'Zaloguj się'}
                </button>
            </form>
        </div>
    );
}
