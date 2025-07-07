// src/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import {NoLayout} from "./layout/NoLayout.tsx";
import {Layout} from "./layout/Layout.tsx";
import {Home} from "./pages/Home.tsx";


const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />

                <Route element={<NoLayout />}>
                    {/*<Route path="/login" element={<Login />} />*/}
                    {/*<Route path="/registration" element={<Registration />} />*/}
                </Route>

                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />

                </Route>
            </Routes>

            <Toaster position="bottom-right" reverseOrder={false} />
        </Router>
    );
};

export default AppRoutes;
