import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CodeDetails from './pages/codeDetails';
import { UserProvider } from './context/UserProvider';
import Login from './pages/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRoutes from './utils/PublicRoutes';
import Logout from './components/Logout';
import VerifyCodePage from './pages/VerifyCodePage';

const App = () => {


  return (
    <UserProvider>
      <Router>
        <Logout />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/qrcode/:id" element={<CodeDetails />} />
          </Route>
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
