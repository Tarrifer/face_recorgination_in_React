import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <button
        onClick={() => navigate("/face-recognition")}
        className="homebutton"
      >
        Face Recognition
      </button>
      <button onClick={() => navigate("/add-user")} className="homebutton">
        Add User
      </button>
      <button onClick={() => navigate("/records")} className="homebutton">
        Records
      </button>
    </div>
  );
};

export default Home;
