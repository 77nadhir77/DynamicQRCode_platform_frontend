import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CodeDetails from './pages/codeDetails';
import { UserProvider } from './context/UserProvider';
import Login from './pages/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRoutes from './utils/PublicRoutes';
import VerifyCodePage from './pages/VerifyCodePage';
import ProtectedLayout from './components/ProtectedLayout';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* 🔒 Routes protégées */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/qrcode/:id" element={<CodeDetails />} />
            </Route>
          </Route>

          {/* 🌐 Routes publiques */}
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/codeverify" element={<VerifyCodePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
