// pages/landing.js

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaQrcode, FaStar, FaGift, FaRecycle } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <FaRecycle className="hero-icon" />
          <h1>Welcome to Smart Dustbin</h1>
          <p>Revolutionizing waste management, one bottle at a time.</p>
          <Link href="/login" legacyBehavior>
            <button className="primary-button">Get Started</button>
          </Link>
        </motion.div>
      </div>

      <div className="section about-section">
        <motion.div
          className="about"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>About Us</h2>
          <p>Smart Dustbin is an innovative solution designed to promote recycling and environmental sustainability. By generating unique QR codes for each bottle deposited, we incentivize users to contribute to a cleaner planet.</p>
        </motion.div>
      </div>

      <div className="section features-section">
        <motion.div
          className="features"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Features</h2>
          <div className="cards">
            <motion.div className="card" whileHover={{ scale: 1.05 }}>
              <FaQrcode className="icon" />
              <h3>QR Code Generation</h3>
              <p>Generate unique QR codes for each bottle deposited.</p>
            </motion.div>
            <motion.div className="card" whileHover={{ scale: 1.05 }}>
              <FaStar className="icon" />
              <h3>Scan to Earn Points</h3>
              <p>Users can scan the QR codes to earn points for each bottle.</p>
            </motion.div>
            <motion.div className="card" whileHover={{ scale: 1.05 }}>
              <FaGift className="icon" />
              <h3>Redeem Rewards</h3>
              <p>Accumulate points and redeem them for exciting rewards.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="section testimonials-section">
        <motion.div
          className="testimonials"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Testimonials</h2>
          <div className="cards">
            <motion.div className="testimonial-card" whileHover={{ scale: 1.05 }}>
              <p>"Smart Dustbin has transformed how we recycle at home. It's fun and rewarding!"</p>
              <p>- Jane Doe</p>
            </motion.div>
            <motion.div className="testimonial-card" whileHover={{ scale: 1.05 }}>
              <p>"I love earning points and redeeming rewards while helping the environment."</p>
              <p>- John Smith</p>
            </motion.div>
            <motion.div className="testimonial-card" whileHover={{ scale: 1.05 }}>
              <p>"A brilliant idea that's making a real difference in our community."</p>
              <p>- Emily Johnson</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="section cta-section">
        <motion.div
          className="cta"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Join the Recycling Revolution</h2>
          <p>Together, we can make a difference. Start your recycling journey with Smart Dustbin today.</p>
          <Link href="/login" legacyBehavior>
            <button className="primary-button">Get Started</button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="social-links">
          <a href="#" aria-label="Facebook"><img src="/facebook-icon.png" alt="Facebook" /></a>
          <a href="#" aria-label="Twitter"><img src="/twitter-icon.png" alt="Twitter" /></a>
          <a href="#" aria-label="Instagram"><img src="/instagram-icon.png" alt="Instagram" /></a>
        </div>
        <p>&copy; 2025 Smart Dustbin. All rights reserved.</p>
      </motion.div>

      <style jsx>{`
        .landing-page {
          font-family: Arial, sans-serif;
          text-align: center;
          background: linear-gradient(to right, #f5f7fa, #c3cfe2);
          color: #333;
          padding: 20px;
          min-height: 100vh;
          overflow-y: auto;
        }
        .hero-section {
          background: linear-gradient(to right, #007991, #78ffd6);
          padding: 100px 20px;
          margin-bottom: 40px;
        }
        .hero-content h1 {
          font-size: 5em; /* Increased font size */
          color: #fff;
        }
        .hero-content p {
          font-size: 1.5em;
          color: #fff;
          margin-bottom: 30px;
        }
        .hero-icon {
          font-size: 5em;
          color: #fff;
          margin-bottom: 20px;
        }
        .about-image {
          width: 100%;
          max-width: 600px;
          margin-top: 20px;
        }
        .section {
          padding: 50px 20px;
        }
        .primary-button {
          padding: 15px 30px;
          font-size: 1em;
          border: none;
          border-radius: 5px;
          background-color: #ff7f50;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .primary-button:hover {
          background-color: #ff4500;
        }
        .about-section {
          background: #fff;
          color: #333;
        }
        .features-section {
          background: #f7f7f7;
          color: #333;
        }
        .cards {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .card {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #007991; /* Updated border color */
          border-radius: 15px; /* Slightly increased border radius */
          padding: 20px;
          margin: 15px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .card h3 {
          margin-bottom: 10px;
          color: #333;
        }
        .card p {
          color: #555;
        }
        .card .icon {
          font-size: 2em;
          color: #007991;
          margin-bottom: 10px;
        }
        .testimonials-section {
          background: #e9e9e9;
          color: #333;
        }
        .testimonial-card {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #bbb; /* Updated border color */
          border-radius: 15px; /* Slightly increased border radius */
          padding: 20px;
          margin: 15px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .cta-section {
          background: #f3f3f3;
          color: #333;
        }
        h2 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2em;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .cta h2 {
          margin-bottom: 20px;
        }
        .cta p {
          margin-bottom: 30px;
        }
        .footer {
          padding: 20px 0;
          background: #333;
          color: #ddd;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .social-links {
          margin-bottom: 10px;
        }
        .social-links a {
          margin: 0 10px;
          display: inline-block;
        }
        .social-links img {
          width: 24px;
          height: 24px;
        }
      `}</style>
    </div>
  );
};

export default Landing;
