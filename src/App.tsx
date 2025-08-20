import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/login/login";
import Registration from "./pages/register/Registration";
import Home from "./pages/home/Home";
import User from "./pages/user/user";
import Caste from "./pages/caste/caste";
import Academics from "./pages/academics/Academics";
import Board from "./pages/Board/board";
import PowerBIReport from "./pages/powerbianalysis/PowerBIReport";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/user" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          } />
          <Route path="/analysis" element={
            <ProtectedRoute>
              <PowerBIReport />
            </ProtectedRoute>
          } />
          <Route path="/caste" element={
            <ProtectedRoute>
              <Caste />
            </ProtectedRoute>
          } />
          <Route path="/academics" element={
            <ProtectedRoute>
              <Academics />
            </ProtectedRoute>
          } />
          <Route path="/board" element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
