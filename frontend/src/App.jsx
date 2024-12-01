import React from "react";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/authContext";

// Pages
import Home from "./pages/Home";

import Header from "./pages/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";


import DeliverySystem from "./pages/delivery_system";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/delivery_system" element={<DeliverySystem />} />
      </Routes>
    </AuthProvider>

  );
};

export default App;
