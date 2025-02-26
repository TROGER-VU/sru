// pages/index.js or your home page component

"use client";

import React, { useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import QRCode from 'react-qrcode-logo';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Home = () => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const decoded = jwt.verify(response.data.token, process.env.NEXT_PUBLIC_JWT_SECRET);
      setUser(decoded);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('/api/auth/signup', { email, password });
      const decoded = jwt.verify(response.data.token, process.env.NEXT_PUBLIC_JWT_SECRET);
      setUser(decoded);
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleScanQRCode = async () => {
    try {
      const response = await axios.post('/api/scan', { qrCode });
      setPoints(response.data.points);
    } catch (error) {
      console.error('Scanning QR code failed:', error);
    }
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Smart Dustbin
      </motion.h1>

      <Link href="/landing" legacyBehavior>
        <a>Visit Landing Page</a>
      </Link>

      {!user ? (
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h2>Signup</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Signup</button>
          </motion.div>
        </div>
      ) : (
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h2>Scan QR Code</h2>
            <input
              type="text"
              placeholder="Enter QR Code"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
            />
            <button onClick={handleScanQRCode}>Scan</button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h2>Your Points</h2>
            <p>{points}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
