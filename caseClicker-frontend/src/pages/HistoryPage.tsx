import React from 'react';
import {HistoryList} from "../components/HistoryList.js";

const HistoryPage: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Historia otwierania</h2>
            <HistoryList />
        </div>
    );
};

export default HistoryPage;
