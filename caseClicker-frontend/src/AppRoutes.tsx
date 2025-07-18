import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import {NoLayout} from "./layout/NoLayout.tsx";
import {Layout} from "./layout/Layout.tsx";
import {Home} from "./pages/Home.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import InventoryPage from "./pages/InventoryPage.tsx";
import WalletPage from "./pages/WalletPage.tsx";


const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />

                <Route element={<NoLayout />}>
                    <Route path="/login" element={<LoginPage  />} />
                    <Route path="/register" element={<RegisterPage  />} />
                </Route>

                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                </Route>
            </Routes>

            <Toaster position="bottom-right" reverseOrder={false} />
        </Router>
    );
};

export default AppRoutes;
