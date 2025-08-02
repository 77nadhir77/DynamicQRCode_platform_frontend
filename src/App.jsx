import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import codeDetails from "./pages/codeDetails";
const App = () => {
  return <Router>
    <Routes>
      <Route path="/" element={<Home />}  />
      <Route path="/qrcode/:id" element={<codeDetails />} />
    </Routes>
  </Router>
};

export default App;
