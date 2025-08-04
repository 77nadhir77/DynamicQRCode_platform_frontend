import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CodeDetails from "./pages/codeDetails";
const App = () => {
  return <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/qrcode/:id" element={<CodeDetails />} />
    </Routes>
  </Router>
};

export default App;
