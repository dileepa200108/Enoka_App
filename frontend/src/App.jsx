import React from "react";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/authContext";

// Pages
import Home from "./pages/Home";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
