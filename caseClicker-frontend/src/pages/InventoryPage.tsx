import React from 'react';
import { InventoryList } from '../components/InventoryList';

const InventoryPage: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Moje Przedmioty</h2>
            <InventoryList />
        </div>
    );
};

export default InventoryPage;
