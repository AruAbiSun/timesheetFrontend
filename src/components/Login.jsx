/* eslint-disable react/no-unescaped-entities */
//import React from 'react';
import { useState } from "react";
import axios from "axios";
import "./Style.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* eslint-disable react/prop-types */

const UserLogin = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("login api payloads", email, password);
    const payloads = { email, password };
    try {
      const res = await axios.post(
        "http://localhost:4000/api/employee/login",
        payloads
      );
      toast.success(res.data.message || "Login Successful");
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      navigate("/timesheet");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Login failed. Please try again."
      );
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <div className="container">
        <div className="justify-content-center">
          <div className="col md-4">
            <div className="box  ">
              <div id="login-form" className="form-container active">
                <h3 className="text-center">Log In</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <br></br>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control"
                    />

                    <br></br>
                    <label>Password </label>
                    <br></br>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control"
                    />

                    <br></br>
                    <div className="mb-3">
                      <a href="" onClick={handleForgotPassword}>
                        Forgot Password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block mt-3"
                    >
                      Login
                    </button>
                    <p className="mt-3 text-center">
                      Don't have an account?{" "}
                      <a href="" onClick={handleRegister}>
                        Sign up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UserLogin;
