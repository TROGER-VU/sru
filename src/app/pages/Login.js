// pages/login.js

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.status === 200) {
        const { token } = response.data;
        // Handle storing token (e.g., in localStorage)
        alert(`Logged in successfully with token: ${token}`);
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Login to Smart Dustbin</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary-button">Login</button>
        </form>
        <p>Don't have an account? <Link href="/signup" legacyBehavior><a>Sign up here</a></Link></p>
      </motion.div>

      <style jsx>{`
        .login-page {
          font-family: Arial, sans-serif;
          text-align: center;
          background: linear-gradient(to right, #f5f7fa, #c3cfe2);
          color: #333;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .login-content {
          background: #fff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1em;
        }
        .primary-button {
          padding: 15px 30px;
          font-size: 1em;
          border: none;
          border-radius: 5px;
          background-color: #007991;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .primary-button:hover {
          background-color: #005f73;
        }
        .error {
          color: red;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Login;
