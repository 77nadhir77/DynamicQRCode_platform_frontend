import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CodeDetails from './pages/codeDetails';
import { UserProvider } from './context/UserProvider';
import Login from './pages/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRoutes from './utils/PublicRoutes';
import { Button } from '@/components/ui/button';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="absolute right-4 top-4">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </Button>
        </div>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/qrcode/:id" element={<CodeDetails />} />
          </Route>
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
