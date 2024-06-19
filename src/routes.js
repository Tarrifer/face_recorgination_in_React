import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FaceRecognition from "./components/FaceRecognition";
import AddUser from "./pages/AddUser";
import Records from "./pages/Records";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/face-recognition" element={<FaceRecognition />} />

        <Route path="/add-user" element={<AddUser />} />
        <Route path="/records" element={<Records />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
