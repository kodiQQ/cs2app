import React from 'react';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 c">
            <h1 className="text-3xl font-bold mb-2">Welcome to the Home Page</h1>
            <p className="text-gray-700">
                This is a simple <code>Home</code> component written in TypeScript and React.
            </p>
        </div>
    );
};