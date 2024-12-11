import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Header from "./pages/Header";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupWG from "./pages/SignupWG";

import CRB from "./pages/crb"


//Sections
import { DeliveryManagement } from "./pages/DeliveryManagementSection";


const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<DeliveryManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/deliveryManagement" element={<DeliveryManagement />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupwg" element={<SignupWG />} />
        <Route path="/crb" element={<CRB />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
