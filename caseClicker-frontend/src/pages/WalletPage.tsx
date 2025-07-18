import React from 'react';
import { WalletBox } from '../components/WalletBox';

const WalletPage: React.FC = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Portfel</h2>
        <WalletBox />
    </div>
);

export default WalletPage;
