import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Registration from "./pages/register/Registration";
import Home from "./pages/home/Home";
import User from "./pages/user/user";
import Caste from "./pages/caste/caste";
import Academics from "./pages/academics/Academics";
import Board from "./pages/Board/board";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/caste" element={<Caste />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
};

export default App;

